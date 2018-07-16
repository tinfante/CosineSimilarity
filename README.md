# Simple Cosine Similarity

A very simple implementation of document similarity in Python, using vectors
of document word frequencies (normalized by corpus vocabulary size) and
[Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity).

Obviously this could be vastly improved using Numpy arrays for vectors, NLP
libraries (NLTK, Spacy) to tokenize and maybe do lemmatization or stemming,
TF-IDF scores instead of frequencies normalized by vocabulary size (e.g. using
Sklearn's TF-IDF Vectorizer), etc., but the goal was to have a very simple,
easily understood, Python implementation from scratch. Furthermore, if one
were to build a real search engine in Python, there's the Whoosh library.
