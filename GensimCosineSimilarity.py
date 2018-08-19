
# coding: utf-8

# In[1]:


# Silence RuntimeWarning: numpy.dtype size changed, may indicate binary incompatibility.
# It's a bening warning when Scipy was compiled against an older Numpy version. Safe to
# ignore.
import logging
logging.basicConfig(
        format='%(asctime)s : %(threadName)s : %(levelname)s : %(message)s',
        level=logging.DEBUG) 
import warnings

warnings.filterwarnings("ignore", message="numpy.dtype size changed")


# In[2]:


import re

documents = ["Human machine interface for lab abc computer applications",
             "A survey of user opinion of computer system response time",
             "The EPS user interface management system",
             "System and human system engineering testing of EPS",
             "Relation of user perceived response time to error measurement",
             "The generation of random binary unordered trees",
             "The intersection graph of paths in trees",
             "Graph minors IV Widths of trees and well quasi ordering",
             "Graph minors A survey"]

# Lets tokenize, normalize to lowercase and remove stopwords.

stopwords = ['for a of and to the in']
tokenized_documents = [[word for word in re.findall(r'\w+', doc.lower()) if word not in stopwords]
                       for doc in documents]
tokenized_documents


# In[3]:


from gensim import corpora

dictionary = corpora.Dictionary(tokenized_documents)
print(dictionary, '\n')
print(dictionary.token2id)


# In[4]:


corpus = [dictionary.doc2bow(tc) for tc in tokenized_documents]
corpus


# In[5]:


from gensim import models

tfidf = models.TfidfModel(corpus)


# In[7]:


from gensim import similarities

index = similarities.SparseMatrixSimilarity(tfidf[corpus], num_features=32)


# In[8]:


new_doc = "Human computer interaction"
new_vec = dictionary.doc2bow(re.findall(r'\w+', new_doc.lower()))
print(new_vec)  # the word "interaction" does not appear in the dictionary and is ignored


# In[ ]:


sims = index[tfidf[new_vec]]
print(sims)

