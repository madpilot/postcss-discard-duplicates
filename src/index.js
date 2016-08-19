import {plugin} from 'postcss';

function dedupe (root) {
    root.each(node => {
        if (node.nodes) {
            dedupe(node);
        }
    });

    if (root.nodes.length < 2) {
        return;
    }

    root.each((node, index) => {
        if (node.type === 'comment') {
            return;
        }

        let nodes = node.parent.nodes;
        let toString = node.toString();
        let result = [node];

        for (let i = index + 1, max = nodes.length; i < max; i++) {
            if (nodes[i].toString() === toString) {
                result.push(nodes[i]);
            }
        }

        let len = result.length;
        while (len > 1) {
            result[len - 1].remove();
            len--;
        }
    });
}

export default plugin('postcss-discard-duplicates', () => dedupe);
