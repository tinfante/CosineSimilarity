#!/usr/bin/env node


const docs = [
    "Natural Language Processing with Python",
    "Handbook of Natural Language Processing",
    "Learning IPython for Interactive Computing and Data Visualization"
];


function tokenize_docs(documents) {
    return documents.map(x => x.match(/\w+/g));
}


function vocabulary(tokenized_docs) {
    var word;
    var vocab = [];
    for (var i=0; i<tokenized_docs.length; ++i) {
        for (var k=0; k<tokenized_docs[i].length; ++k) {
            word = tokenized_docs[i][k].toLowerCase();
            if (!vocab.includes(word)) vocab.push(word);
        }
    }
    return vocab.sort();
}


function counter(tokens) {
    var freqs = {};
    for (var i=0; i<tokens.length; ++i) {
        freqs[tokens[i]] = freqs[tokens[i]] ? freqs[tokens[i]] + 1 : 1;
    }
    return freqs;
}


function vectorize(tokenized_docs, vocabulary) {
    var vecs = [];
    var vec;
    var count;
    for (var i=0; i<tokenized_docs.length; ++i) {
        vec = [];
        count = counter(tokenized_docs[i].map(x => x.toLowerCase()));
        for (var k=0; k<vocabulary.length; ++k) {
            if (count.hasOwnProperty(vocabulary[k])) {
                vec.push(count[vocabulary[k]])
            } else {
                vec.push(0);
            }
        }
        vecs.push(vec);
    }
    return vecs;
}

const tokenized = tokenize_docs(docs);
const lexicon = vocabulary(tokenized);
const vecs_count = vectorize(tokenized, lexicon);
//const vecs_tdfif = tfidf(

console.log(lexicon);
console.log(vecs_onehot);
