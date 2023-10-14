import { getCollection } from 'astro:content';

export type TreeNode = {
  [key: string]: TreeNodeValue | string;
};

export type TreeNodeValue = {
  path: string;
  text?: string;
  children?: TreeNode;
}

export type NavItem = {
    slug: string;
    text?: string;
    items?: NavItem[];
};

function isTreeNodeValue(value: string | TreeNodeValue): value is TreeNodeValue {
  return typeof value !== 'string';
}

export async function convertToTree(data: NavItem[]): Promise<TreeNode> {
  const tree: TreeNode = {};
  const entries = await getCollection('posts');

  function findTitleForPath(path: string): string | undefined {
    const modifiedPath = path.startsWith('/') ? path.slice(1) : path;  // 最初の'/'を削除
    let entry = entries.find(e => e.slug.endsWith(modifiedPath));
    // 末尾がindex.htmlの場合のマッチングを試みる
    if (!entry && modifiedPath.endsWith('/index.html')) {
      const shortenedPath = modifiedPath.replace(/\/[^\/]+$/, '');  // 最後の"/"以下を削除
      entry = entries.find(e => e.slug.endsWith(shortenedPath));
    }
  return entry ? entry.data.title : undefined;
  }

  function recurse(items: NavItem[], currentLevel: TreeNode, path: string = '') {
    items.forEach(item => {
      const newPath = `${path}/${item.slug}`;
      if (item.items) {
        if (!currentLevel[item.slug]) {
          currentLevel[item.slug] = {
            path: newPath,
            text: item.text,
            children: {}
          };
        }
        recurse(item.items, currentLevel[item.slug].children as TreeNode, newPath);
      } else {
        const title = findTitleForPath(newPath);
        currentLevel[item.slug] = {
          path: newPath,
          text: title || item.text
        };
      }
    });
  }

  recurse(data, tree);
  return tree;
}
