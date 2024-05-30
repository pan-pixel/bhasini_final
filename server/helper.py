import requests
from openai import OpenAI
import os
from dotenv import load_dotenv
import concurrent.futures
load_dotenv()

openai = OpenAI(api_key=os.getenv("API_KEY"))

translateModels = {
    "all" : "ai4bharat/indictrans-v2-all-gpu--t4",
    "or" : "Bhashini/IIITH/Trans/V1",
    "orNext" : "ai4bharat/indictrans-v2-all-gpu--t4"
}

voiceModels ={
    "hi" : "ai4bharat/conformer-hi-gpu--t4",                            #Hindi
    "en" : "ai4bharat/whisper-medium-en--gpu--t4",                      #English
    "pa" : "ai4bharat/conformer-multilingual-indo_aryan-gpu--t4",       #Punjabi
    "or" : "ai4bharat/conformer-multilingual-indo_aryan-gpu--t4",       #Oriya
    "mr" : "bhashini/iitm/asr-indoaryan--gpu--t4",                      #Marathi
    "ml" : "bhashini/iitm/asr-dravidian--gpu--t4",                      #Malayalam
    "kn" : "ai4bharat/conformer-multilingual-dravidian-gpu--t4",        #Kannada
    "gu" : "bhashini/iitm/asr-indoaryan--gpu--t4",                      #Gujarati
    "bn" : "bhashini/iitm/asr-indoaryan--gpu--t4",                      #Bengali
    "te" : "bhashini/iitm/asr-dravidian--gpu--t4",                      #Telugu

    "ur" : "bhashini/iitm/asr-misc--gpu--t4",                           #Urdu
    "sa" : "ai4bharat/conformer-multilingual-indo_aryan-gpu--t4",       #Sanskrit
    
    "ta" : "bhashini/iitm/asr-dravidian--gpu--t4"                       #Tamil
}




def convertToCommand(text):
    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "user", "content": "From now on, I will be giving you text in various languages, if the overall meaning of the text is to go to next page or move ahead or show something else respond with 'next', if it is to go to previous page or show any previous item respond with 'previous' and if it means to add product to cart, add to basket or buy the product respond with 'cart'"},
            {"role": "user", "content": text}
        ]
    )
    res =  completion.choices[0].message.content.lower()
    if (res == 'cart' or res == 'next' or res == 'previous'):
        return res
    else:
        return "again"

def callBhashiniASR(base64_content, selectedLang):
    if selectedLang == "or":
        targetLangAPI = translateModels["or"]
    else:
        targetLangAPI = translateModels["all"]

    url = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline'
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': os.getenv("AUTH"),
        'Connection': 'keep-alive'
    }

    request_body1 = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {
                        "sourceLanguage": selectedLang
                    },
                    "serviceId": voiceModels[selectedLang],
                    "audioFormat": "flac",
                    "samplingRate": 16000
                }
            }
        ],
        "inputData": {
            "audio": [
                {
                    "audioContent": base64_content
                }
            ]
        }
    }
    request_body2 = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {
                        "sourceLanguage": selectedLang
                    },
                    "serviceId": voiceModels[selectedLang],
                    "audioFormat": "flac",
                    "samplingRate": 16000
                }
            },
            {
            "taskType": "translation",
            "config": {
                "language": {
                    "sourceLanguage": selectedLang,
                    "targetLanguage": "en"
                },
                "serviceId": targetLangAPI
                }
            }
        ],
        "inputData": {
            "audio": [
                {
                    "audioContent": base64_content
                }
            ]
        }
    }

    try:

        if(selectedLang == "en"):
            response = requests.post(url, headers=headers, json=request_body1)
        else:
            response = requests.post(url, headers=headers, json=request_body2)

        if not response.ok:
            response.raise_for_status()

        responseData = response.json()
        if(selectedLang == "en"):
            translation = responseData['pipelineResponse'][0]['output'][0]['source'].lower()
        else:
            translation = responseData['pipelineResponse'][1]['output'][0]['target'].lower()
        # print("Original : ", responseData['pipelineResponse'][1]['output'][0]['source'].lower())
        print("Translated : ",translation)
        if ('next' in translation or 'ahead' in translation):
            return 'next'
        elif ('previous' in translation):
            return 'previous'
        elif ('cart' in translation or 'cut' in translation):
            return 'cart'
        else:
            print("USING GPT")
            return convertToCommand(translation)

    except Exception as e:
        print('There was a problem with the fetch operation:', e)
        raise e
    
    
def process_text(t, selectedLang, url, headers, translation_cache):
    if t in translation_cache:
        return t, translation_cache[t]
    
    body = {
        "pipelineTasks": [
            {
                "taskType": "transliteration",
                "config": {
                    "language": {
                        "sourceLanguage": "en",
                        "targetLanguage": selectedLang
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4",
                    "isSentence": "false",
                    "numSuggestions": 7
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": t
                }
            ]
        }
    }

    response = requests.post(url, headers=headers, json=body)
    if not response.ok:
        response.raise_for_status()
    
    responseData = response.json()
    translated = responseData['pipelineResponse'][0]['output'][0]['target']
    
    return t, translated


def processAllContent(text, selectedLang):
    url = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline'
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': os.getenv("AUTH"),
        'Connection': 'keep-alive'
    }

    translation_cache = {}
    res = [None] * len(text)  # Pre-allocate the result list

    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Create a list of future tasks with their indices
        future_to_index = {executor.submit(process_text, t, selectedLang, url, headers, translation_cache): i for i, t in enumerate(text)}
        
        for future in concurrent.futures.as_completed(future_to_index):
            index = future_to_index[future]
            try:
                original, translated = future.result()
                translation_cache[original] = translated
                res[index] = translated  # Place the result in the correct position
            except Exception as e:
                print(f'There was a problem with the fetch operation for text "{text[index]}":', e)
    
    return res




def processAllContentSingle(text, selectedLang):
    url = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline'
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': os.getenv("AUTH"),
        'Connection': 'keep-alive'
    }

    res = []
    cache = {}
    
    try:
        for t in text:
            if t in cache:
                translated = cache[t]
            else:
                body = {
                    "pipelineTasks": [
                        {
                            "taskType": "transliteration",
                            "config": {
                                "language": {
                                    "sourceLanguage": "en",
                                    "targetLanguage": selectedLang
                                },
                                "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4",
                                "isSentence": "false",
                                "numSuggestions": 7
                            }
                        }
                    ],
                    "inputData": {
                        "input": [
                            {
                                "source": t
                            }
                        ]
                    }
                }
                response = requests.post(url, headers=headers, json=body)
                if not response.ok:
                    response.raise_for_status()
                responseData = response.json()
                translated = responseData['pipelineResponse'][0]['output'][0]['target']
            print("Earlier - " , t, "\nTranslated - ", translated)
            res.append(translated)
        return res
    except Exception as e:
        print('There was a problem with the fetch operation:', e)
        raise e

