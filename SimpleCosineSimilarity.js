#!/usr/bin/env node


const docs = [
    "Natural Language Processing with Python",
    "Handbook of Natural Language Processing",
    "Learning IPython for Interactive Computing and Data Visualization"
];

const tokenized = docs.map(x => x.match(/\w+/g));

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

const lexicon = vocabulary(tokenized);

const vector_template = lexicon.map(x => [x, 0]);

function counter(tokens) {
    var freqs = {};
    for (var i=0; i<tokens.length; ++i) {
        freqs[tokens[i]] = freqs[tokens[i]] ? freqs[tokens[i]] + 1 : 1;
    }
    return freqs;
}

function vectors(tokenized_docs, vocab_list) {
    var vecs = [];
    for (var i=0; i<tokenized_docs.length; ++i) {
        var vec = vector_template.slice();
        var counts = counter(tokenized_docs[i].map(x => x.toLowerCase()));
        console.log(vec);
        console.log(counts)
    }
}

console.log(lexicon);
vectors(tokenized, lexicon);
