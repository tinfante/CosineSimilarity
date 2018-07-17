# Simple Cosine Similarity

A very simple implementation of document similarity in Python using TF-IDF
vectors and [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity).

Obviously this could be vastly improved using Numpy arrays and NLP libraries
(NLTK, Spacy) to tokenize and maybe do lemmatization or stemming. It could
also be much shorter (e.g. using Sklearn's TF-IDF Vectorizer), but the goal
was to have a very simple, easily understood, Python implementation from
scratch. If one were to build a real search engine with Python, then there's
the Whoosh library.