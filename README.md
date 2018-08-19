# Cosine Similarity

## SimpleCosineSimilarity

A very simple implementation of document similarity in Python using TF-IDF
vectors and [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity).

Obviously this could be vastly improved using Numpy arrays, NLP libraries
(e.g. NLTK, Spacy) to tokenize and maybe do lemmatization or stemming, an
inverted index for querying in constant time, additive smoothing, etc. It
could also be much shorter (e.g. using Sklearn's TF-IDF Vectorizer), but
the goal was to have a very simple, easily understood, Python implementation
from scratch. If one were to build a search engine in Python, then there's
the excellent Whoosh library, that does all this and more.

## SklearnCosineSimilarity

An example showing how easy it is to do the same using Sklearn's TF-IDF
Vectorizer class and cosine_similarity function. Again, this could be
improved doing stemming/lemmatization, improving stopword filtering,
using n-grams, etc., but the idea is to keep it simple and show how it
can be done in less than 10 lines of code.

## Gensim Cosine Similarity

Same as above, but using Gensim instead of Sklearn.

