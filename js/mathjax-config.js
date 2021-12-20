MathJax = {
//      loader: {load: ['[tex]/tagformat']},
//      loader: {load: ['[tex]/textmacros']}
  tex: {
//        packages: ['base'],
//        packages: {'[+]': ['tagformat']},
//        useLabelIds: true,
//        processRefs: true,
    inlineMath: [['$', '$'], ['\\(', '\\)']],
//        displayMath: [             // start/end delimiter pairs for display math
//          ['$$', '$$'],
//          ['\\[', '\\]']

//        ]
    tags: 'ams'
/*        tagformat: {
       number: (n) => n.toString(),
       tag:    (tag) => '(' + tag + ')',
       id:     (id) => 'mjx-eqn:' + id.replace(/\s/g, '_'),
       url:    (id, base) => base + '#' + encodeURIComponent(id),
     } // tagformat */
   } // tex
}; // MathJax
