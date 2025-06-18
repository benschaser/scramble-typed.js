//preorder traversal
function traverse(el, callback) {
    if (!el) return;
    const children = Array.from(el.children);
    callback(el);
    children.forEach(child => {
        traverse(child, callback);
    });
}