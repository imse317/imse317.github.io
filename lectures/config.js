remark.macros.scale = function (percentage) {
    var url = this;
    return '<img src="' + url + '" style="width: ' + percentage + '" />';
  };

// from https://github.com/gnab/remark/issues/645
function replaceBsInline(match, p1, offset, string){
  p1 = p1.replaceAll("\\_", "_");    // this to avoid replacing "_" twice for nested delimiters (e.g., $$\text{I'm $x_1$}$$)
  return "$" + p1.replaceAll("_", "\\_") + "$";
} 

function replaceBs(match, p1, offset, string){
  return "$$" + p1.replaceAll("_", "\\_") + "$$";
}

s = document.body.innerHTML;

s = s.replaceAll(/\$\$([^]*?)\$\$/g, replaceBs);
s = s.replaceAll(/\$(.*?)\$/g, replaceBsInline);

document.body.innerHTML = s;


var slideshow = remark.create({
countIncrementalSlides: false,
highlightStyle: 'zenburn',
highlightLanguage: 'python',
highlightSpans: true,
});

// Setup MathJax
MathJax.Hub.Config({
    tex2jax: {
    skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'], 
    inlineMath: [['$','$'], ['\\(','\\)']]
    },
    "HTML-CSS": { scale: 81, linebreaks: { automatic: true } }   // change default font size
});

MathJax.Hub.Configured();
  