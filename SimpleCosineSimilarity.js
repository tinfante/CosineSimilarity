#!/usr/bin/env node

module.exports = main;


/**
 * Tokeniza una lista de documentos en palabras. Recibe un array de strings,
 * devuelve un array de arrays de strings.
 */
function tokenize_docs(documents) {
    return documents.map(x => x.match(/\w+/g));
}


/**
 * Extrae el vocabulario de una lista de documentos tokenizados. Recibe un
 * array de arrays de strings, devuelve un array ordenado alfabéticamente con
 * los strings únicos (normalizadas a minúscula) que hay.
 */
function vocabulary(tokenized_docs) {
    var vocab = [];
    for (var i=0; i<tokenized_docs.length; ++i) {
        for (var k=0; k<tokenized_docs[i].length; ++k) {
            var word = tokenized_docs[i][k].toLowerCase();
            if (!vocab.includes(word)) vocab.push(word);
        }
    }
    return vocab.sort();
}


/**
 * Cuenta los tokens en una lista de tokens. Recibe un array con strings,
 * devuelve un objeto donde las llaves son tokens y los valores su frecuencia.
 */
function counter(tokens) {
    var freqs = {};
    for (var i=0; i<tokens.length; ++i) {
        freqs[tokens[i]] = freqs[tokens[i]] ? freqs[tokens[i]] + 1 : 1;
    }
    return freqs;
}


/**
 * Crea vectores de conteo de frecuencia de palabras (normalizadas a minúscula)
 * a partir de una lista de documentos tokenizados y una lista con palabras de
 * vocabulario. Recibe un array de arrays de strings y un array de strings,
 * devuelve un array de array de integers.
 */
function count_vectorize(tokenized_docs, vocabulary) {
    var vecs = [];
    for (var i=0; i<tokenized_docs.length; ++i) {
        var vec = [];
        var count = counter(tokenized_docs[i].map(x => x.toLowerCase()));
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


/*
 *
 */
function tfidf_vectorize(count_vectors, vocabulary) {
    const count_sums = count_vectors.reduce(function(total, vec) {
        for (var i=0; i<total.length; ++i) {
            total[i] += vec[i];
        }
        return total;
    }, new Array(vocabulary.length).fill(0));

    // count_vectors copy to mutate into TF-IDF vectors.
    var cvc = JSON.parse(JSON.stringify(count_vectors));
    for (var i=0; i<cvc.length; ++i) {
        for (var j=0; j<cvc[i].length; ++j) {
            var tf = cvc[i][j] / cvc[i].length;
            var idf = Math.log2(cvc.length / count_sums[j]);
            cvc[i][j] = tf * idf;
        }
    }
    return [cvc, count_sums];
}


/*
 *
 */
function cosine_similarity(vec1, vec2) {
    var dot_product = 0;
    for (var i=0; i<vec1.length; ++i) {
        dot_product += vec1[i] * vec2[i];
    }
    var magnitude1 = Math.sqrt(vec1.reduce((x, y) => x + y**2, 0));
    var magnitude2 = Math.sqrt(vec2.reduce((x, y) => x + y**2, 0));
    return dot_product / (magnitude1 * magnitude2)
}


/*
 *
 */
function query_vectorize(query, vocab, model_num_docs, model_word_counts) {
    var qtoks = tokenize_docs([query])[0];
    var count_vec = count_vectorize([qtoks], vocab)[0];
    var tfidf_vec = new Array(vocab.length).fill(0);
    for (var i=0; i<count_vec.length; ++i) {
        var tf = count_vec[i] / count_vec.length;
        var idf = Math.log2(model_num_docs / model_word_counts[i]);
        tfidf_vec[i] = tf * idf;
    }
    return tfidf_vec;
}


/*
 *
 */
function main(documents) {
    const tokenized = tokenize_docs(documents);
    const lexicon = vocabulary(tokenized);
    const count_vecs = count_vectorize(tokenized, lexicon);
    const [tfidf_vecs, word_freqs] = tfidf_vectorize(count_vecs, lexicon);
    this.query = function (text) {
        query_vec = query_vectorize(
                text, lexicon, tfidf_vecs.length, word_freqs);
        var ranked = [];
        for (var i=0; i<tfidf_vecs.length; ++i) {
            ranked.push([cosine_similarity(query_vec, tfidf_vecs[i]), documents[i]]);
        }
        return ranked.sort((x, y) => y[0] - x[0]);
    }
}
