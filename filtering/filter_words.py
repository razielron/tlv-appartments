import json
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
        return 'filters.json'
    @constant
    def postsData():
        return '../postsData.json'

CONST = _Const()


def get_words(fileName):
  '''This function will get the file name
     and will return a list of only hebrew words that are in this file'''
  with open(fileName, "r", encoding="utf8") as content:
    text = content.read().strip()
  tokens = word_tokenize(text)
  hebrew_fliped_words = [w for w in tokens if w and any(ord(c) > 127 and c.isalpha() for c in w)]
  return [word[::-1] for word in hebrew_fliped_words]


def main():
  post_words = get_words(CONST.postsData)
  #get list of known filtering words:
  with open(CONST.filters_file, 'r', encoding="utf8") as file:
    filters = json.load(file)
  filters_list = [word[::-1] for word in filters['words']]
  #Search for specific words:
  fusion_words = [i for i in filters_list if i in post_words]
  if fusion_words:
    print(f'This appartment has the following properties: {fusion_words}')
  else:
    print('This appartment is not our match!')


if __name__ == "__main__":
    main()