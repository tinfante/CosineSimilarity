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


function count_vecs(tokenized_docs, vocabulary) {
    var count;
    var vec;
    var vecs = [];
    for (var i=0; i<tokenized_docs.length; ++i) {
        vec = [];
        count = counter(tokenized_docs[i].map(x => x.toLowerCase()));
        for (var k=0; k<vocabulary.length; ++k) {
            if (count.hasOwnProperty(vocabulary[k])) {
                vec.push(count[vocabulary[k]])
            }
            else {
                vec.push(0);
            }
        }
        vecs.push(vec);
    }
    return vecs;
}


function tfidf_vecs(count_vectors, vocabulary) {
    var tf;
    var idf;
    const count_sums = count_vectors.reduce(function(total, vec) {
        for (var i=0; i<total.length; ++i) {
            total[i] += vec[i];
        }
        return total;
    }, new Array(vocabulary.length).fill(0));

    // count_vectors copy to mutate into TF-IDF vectors.
    cvc = JSON.parse(JSON.stringify(count_vectors));
    for (var i=0; i<cvc.length; ++i) {
        for (var j=0; j<cvc[i].length; ++j) {
            tf = cvc[i][j] / cvc[i].length;
            idf = Math.log2(cvc.length / count_sums[j]);
            cvc[i][j] = tf * idf;
        }
    }
    return [cvc, count_sums];
}


function cosine_similarity(vec1, vec2) {
    var dot_product = 0;
    for (var i=0; i<vec1.length; ++i) {
        dot_product += vec1[i] * vec2[i];
    }
    var magnitude1 = Math.sqrt(vec1.reduce((x, y) => x + y**2, 0));
    var magnitude2 = Math.sqrt(vec2.reduce((x, y) => x + y**2, 0));
    return dot_product / (magnitude1 * magnitude2)
}


const tokenized = tokenize_docs(docs);
const lexicon = vocabulary(tokenized);
const countv = count_vecs(tokenized, lexicon);
const [tfidf_model, model_word_freqs] = tfidf_vecs(countv, lexicon);


//console.log(tokenized);
//console.log(lexicon);
//console.log(countv);
//console.log(tfidfv);

for (var i=0; i<tfidf_model.length; ++i) {
    for (var j=0; j<tfidf_model.length; ++j) {
        process.stdout.write(
            String((cosine_similarity(tfidf_model[i], tfidf_model[j])).toFixed(3)) + '\t'
            );
    }
    console.log();
}
console.log();


function query_vectorize(query, vocab, model_num_docs, model_word_counts) {
    var qtoks = tokenize_docs([query])[0];
    var count_vec = count_vecs([qtoks], vocab)[0];
    var tfidf_vec = new Array(lexicon.length).fill(0);
    for (var i=0; i<count_vec.length; ++i) {
        var tf = count_vec[i] / count_vec.length;
        var idf = Math.log2(model_num_docs, model_word_counts[i]);
        tfidf_vec[i] = tf * idf;
    }
    return tfidf_vec;
}


const query = "IPython Interactive Computing and Visualization Cookbook";
const query_vec = query_vectorize(query, lexicon, tfidf_model.length, model_word_freqs);

for (var i=0; i<tfidf_model.length; ++i) {
    console.log(cosine_similarity(query_vec, tfidf_model[i]));
}
