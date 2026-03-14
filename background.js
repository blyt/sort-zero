const api = globalThis.browser ?? globalThis.chrome;
let sortingCount = 0;
const debounceTimers = new Map();
const DEBOUNCE_MS = 250;

const compare = (a, b) =>
  a.title.localeCompare(b.title, undefined, { sensitivity: "base" });

async function sortFolder(folderId) {
  const children = await api.bookmarks.getChildren(folderId);
  if (children.length === 0) return [];
  const subfolderIds = [], groups = [], separators = [];
  let currentGroup = [];

  for (const child of children) {
    if (child.type === "separator") {
      groups.push(currentGroup);
      separators.push(child);
      currentGroup = [];
    } else {
      if (!child.url) subfolderIds.push(child.id);
      currentGroup.push(child);
    }
  }
  groups.push(currentGroup);

  const sortedGroups = groups.map((group) => [
    ...group.filter((item) => !item.url).sort(compare),
    ...group.filter((item) => item.url).sort(compare),
  ]);

  const reassembled = sortedGroups.flatMap((group, i) =>
    i < separators.length ? [...group, separators[i]] : group
  );

  sortingCount++;
  try {
    for (let i = 0; i < reassembled.length; i++)
      await api.bookmarks.move(reassembled[i].id, { parentId: folderId, index: i });
  } finally {
    sortingCount--;
  }
  return subfolderIds;
}

async function sortFolderRecursive(folderId) {
  const subfolderIds = await sortFolder(folderId);
  for (const id of subfolderIds) await sortFolderRecursive(id);
}

async function sortAll() {
  const tree = await api.bookmarks.getTree();
  for (const container of tree[0].children) await sortFolderRecursive(container.id);
}

function debounceSortFolder(folderId) {
  clearTimeout(debounceTimers.get(folderId));
  debounceTimers.set(
    folderId,
    setTimeout(() => {
      debounceTimers.delete(folderId);
      if (sortingCount === 0) sortFolder(folderId).catch(console.error);
    }, DEBOUNCE_MS)
  );
}

function onBookmarkCreatedMovedRemoved(id, info) {
  if (sortingCount > 0) return;
  debounceSortFolder(info.parentId);
}

async function onBookmarkChanged(id) {
  if (sortingCount > 0) return;
  const [node] = await api.bookmarks.get(id).catch(() => []);
  if (node) debounceSortFolder(node.parentId);
}

api.bookmarks.onCreated.addListener(onBookmarkCreatedMovedRemoved);
api.bookmarks.onMoved.addListener(onBookmarkCreatedMovedRemoved);
api.bookmarks.onRemoved.addListener(onBookmarkCreatedMovedRemoved);
api.bookmarks.onChanged.addListener(onBookmarkChanged);

api.runtime.onStartup.addListener(() => sortAll().catch(console.error));
api.runtime.onInstalled.addListener(() => sortAll().catch(console.error));
