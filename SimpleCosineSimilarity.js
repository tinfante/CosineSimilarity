#!/usr/bin/env node
/*
 * Módulo para crear un modelo espacio vectorial con Term Frequency-Inverse
 * Document Frequency y hacerle queries con Cosine Similarity. La clase
 * exportada se construye con una lista de documentos, y la instancia expone
 * el método query() que recibe un string, y devuelve un ranking de los
 * documentos más parecidos en el modelo.
 */


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
 * Crea una lista de vectores tf-idf y una lista de frecuencias totales a
 * partir de una lista de vectores de frecuencia y una lista de vocabulario.
 * Recibe un array de arrays de integers y un array de strings, y devuelve un
 * array de array de floats y un array de ints.
 */
function tfidf_vectorize(count_vectors, vocabulary) {
    const count_sums = count_vectors.reduce(function(total, vec) {
        for (var i=0; i<total.length; ++i) {
            total[i] += vec[i];
        }
        return total;
    }, new Array(vocabulary.length).fill(0));

    // deep copy de count_vectors para mutar a vectores tf-idf.
    var cvc = JSON.parse(JSON.stringify(count_vectors));
    for (var i=0; i<cvc.length; ++i) {
        var doc_length = cvc[i].filter(i => i != 0).length;
        for (var j=0; j<cvc[i].length; ++j) {
            // TF: hay varias opciones, una típica y la que usamos acá es la
            // frecuencia del término en el documento partido por el largo del
            // documento.
            var tf = cvc[i][j] / doc_length;
            // IDF: cantidad de documentos partido por la frecuencia del término
            // en todos los documentos.
            var idf = Math.log2(cvc.length / count_sums[j]);
            cvc[i][j] = tf * idf;
        }
    }
    return [cvc, count_sums];
}


/*
 * Calcula la similitud de coseno de dos vectores. Recibe una lista de floats,
 * devuelve un float entre 0 y 1.
 */
function cosine_similarity(vec1, vec2) {
    var dot_product = 0;
    for (var i=0; i<vec1.length; ++i) {
        dot_product += vec1[i] * vec2[i];
    }
    const magnitude1 = Math.sqrt(vec1.reduce((x, y) => x + y**2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((x, y) => x + y**2, 0));
    return dot_product / (magnitude1 * magnitude2)
}


/*
 * Hace un vector tf-idf de una query y la lista de vocabulario, número de
 * documentos y conteo de frecuencia de palabras del modelo. Recibe un string,
 * un array de strings, un int y un objeto cuyas llaves son palabras del
 * vocabulario del modelo y sus respectivas frecuencias. Devuelve un array
 * de floats.
 */
function query_vectorize(query, vocab, model_num_docs, model_word_counts) {
    const qtoks = tokenize_docs([query])[0];
    const count_vec = count_vectorize([qtoks], vocab)[0];
    var tfidf_vec = new Array(vocab.length).fill(0);
    for (var i=0; i<count_vec.length; ++i) {
        var tf = count_vec[i] / count_vec.length;
        var idf = Math.log2(model_num_docs / model_word_counts[i]);
        tfidf_vec[i] = tf * idf;
    }
    return tfidf_vec;
}


/*
 * Constructor de la clase, recibe una lista de documentos (array de strings),
 * crea el modelo vectorial tf-idf de ellos, y hace público el método query()
 * para ver la similitud de una query con los documentos del modelo.
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
