import json
import sys
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize

#constants:
def constant(f):
    def fset(self, value):
        raise TypeError
    def fget(self):
        return f()
    return property(fget, fset)

class _Const(object):
    @constant
    def filters_file():
        return 'filtering/filters.json'
    @constant
    def postsData():
        return 'postsData.json'
    def check_file():
      return 'check.json'

CONST = _Const()


def get_words(content):
  '''This function will get the file name
     and will return a list of only hebrew words that are in this file'''
  #with open(fileName, "r", encoding="utf8") as content:
  text = content.strip()
  tokens = word_tokenize(text)
  hebrew_words = [w for w in tokens if w and any(ord(c) > 127 and c.isalpha() for c in w)]
  print([word[::-1] for word in hebrew_words])  #Prints the post with hebrew flipped words
  return hebrew_words



def get_numbers(filename):
  return True


def next_q(current_q, word):
  for key in current_q:    
    for w in current_q[key]:
      if w == word:
        return key
  return 'q0'


def check_post(post):
  return check_words(get_words(post['postText']))


def check_words(words):
  current_q = "q0"
  with open(CONST.filters_file, 'r', encoding="utf8") as file:
      filters = json.load(file)
  for word in words:
      current_q = next_q(filters[current_q], word)
      if current_q == 'q2':
        break
  print(current_q)
  return current_q    


def get_post(filepath):
  post = None
  with open(filepath, 'r', encoding="utf8") as file:
      post = json.load(file)
  return post


def save_result(result):
  result = {
    "result": result
  }
  with open('result.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=4)


def online_flow(path):
  post = get_post(path)
  result = check_post(post) != "q2"
  save_result(result)



def main():
  with open(CONST.postsData, 'r', encoding="utf8") as content:
    allData = json.load(content)
  #my_words = ['ןיידע', 'תיטנוולר', 'הפלחהל', 'דבלב', 'עיצמ', 'תריד', 'רדח', 'יצחו', 'תספרמ', 'הרוגס', 'רדח', 'שממ', 'לודג', 'חבטמ', 'תספרמו', 'הרוגס', 'עגרכ', 'ינא', 'שמתשמ', 'תספרמב', 'רותב', 'רדח', 'הניש', 'לבא', 'רשפא', 'תונשל', 'ליבשב', 'רדח', 'קנע', 'תספרמו', 'הווש', 'מ', 'ר', 'והימריב', 'ןופצ', 'ןשי', 'שממ', 'לע', 'ףוגניזיד/קראפ/םיה', '0053-ב', 'דע', 'םויס', 'הזוחה', 'ףוסב', 'רבמצד', 'ןבומכ', 'םע', 'היצפוא', 'הכראהל', 'לומ', 'לעבה', 'תיב', 'הרידה', 'רפוס', 'תראומ', 'המוקב', 'אלל', 'םע', 'חבטמ', 'דרפנ', 'ללוכ', 'זג', 'תתתיקנע', 'דיחיל', 'המיאתמ', 'םג', 'גוזל', 'שי', 'היצפוא', 'תונקל', 'קלח', 'טוהירהמ', 'ללוכ', 'תנוכמ', 'הסיבכ', 'לבא', 'שממ', 'אל', 'הבוח', 'שפחמ', 'תריד', 'םירדח', 'גוזל', 'תוחפל', 'מ', 'ר', 'םע', 'חבטמ', 'חוורמ', 'תופידע', 'תחאל', 'םע', 'תספרמ', 'וא', 'רצח', 'ןורתי', 'קנע', 'םא', 'שי', 'הינח', 'רוזיאב', 'ןופצ', 'שדח/ןשי', 'יד', 'םישימג', 'רוזיאב', 'זא', 'לא', 'וססהת', 'עיצהל', 'דע']
  #my_words = [word[::-1] for word in my_words]
  for post in allData['postsData']:
    print(post['postUrl'])
    post_words = get_words(post['postText'])  
    #get list of known filtering words:
    with open(CONST.filters_file, 'r', encoding="utf8") as file:
      filters = json.load(file)
    #handles bad flow:
    current_q = "q0"
    for word in post_words:
      current_q = next_q(filters[current_q], word)
      if current_q == 'q2':
        break
    print(current_q)    
  #check_post(my_words)


if __name__ == "__main__":
  if len(sys.argv) == 0:
    main()
  else:    
    post_path = sys.argv    
    online_flow(post_path[1])

