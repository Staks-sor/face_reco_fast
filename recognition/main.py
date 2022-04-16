from deepface import DeepFace
import json






async def face_analyze(img):
    try:
        # result_dict = DeepFace.analyze(img_path='faces/jim.jpg', actions=['age', 'gender', 'race', 'emotion'])
        # result_dict = DeepFace.analyze(img_path='faces/adr.jpg', actions=['age', 'gender', 'race', 'emotion'])
        result_dict = DeepFace.analyze(img_path=img, actions=['age', 'gender', 'race', 'emotion'], enforce_detection=False)
        # result_dict = DeepFace.analyze(img_path=img, actions=['age'], enforce_detection=False)
        
        with open('face_analyze.json', 'w') as file:
            json.dump(result_dict, file, indent=4, ensure_ascii=False)
            
        # print(f'[+] Age: {result_dict.get("age")}')
        # print(f'[+] Gender: {result_dict.get("gender")}')
        # print('[+] Race:')
        
        # for k, v in result_dict.get('race').items():
        #     print(f'{k} - {round(v, 2)}%')
            
        # print('[+] Emotions:')
        
        # for k, v in result_dict.get('emotion').items():
        #     print(f'{k} - {round(v, 2)}%')
            
        return result_dict

    except Exception as _ex:
        return _ex

    
def main():
    # print(face_verify(img_1='faces/em1.jpg', img_2='faces/snoop.jpg'))
    # print(face_recogn())
    face_analyze()
    
    
if __name__ == '__main__':
    main()
