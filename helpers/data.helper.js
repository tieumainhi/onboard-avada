import { normalizeArray } from "../utils/checkArray.js";

export function mapUsersWithPostsAndComments(users, posts, comments) {
    console.time('mapUsersWithPostsAndComments');
    const safeUsers = normalizeArray(users);
    const safePosts = normalizeArray(posts);
    const safeComments = normalizeArray(comments);

    const postsByUserId = groupBy(safePosts, (post) => post.userId);
    //  ex: postsByUserId = {
    //     1: [ { id: 1, userId: 1, title: '...', body: '...' }, ... ],
    //     2: [ { id: 11, userId: 2, title: '...', body: '...' }, ... ],
    //     ...
    // }

    const commentsByPostId = groupBy(safeComments, (comment) => comment.postId);
    //  ex: commentsByPostId = {
    //     1: [ { id: 1, postId: 1, name: '...', email: '...', body: '...' }, ... ],
    //     2: [ { id: 6, postId: 2, name: '...', email: '...', body: '...' }, ... ],
    //     ...
    // }

    const result = safeUsers.map((user) => {
        const userPosts = (postsByUserId[user.id] ?? []).map((post) => ({
            id: post.id,
            title: post.title,
            body: post.body,
            comments: (commentsByPostId[post.id] ?? []).map((comment) => ({
                id: comment.id,
                postId: comment.postId,
                name: comment.name,
                body: comment.body,
            })),
        }))

        const userComments = userPosts.flatMap((post) => post.comments);

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            comments: userComments,
            posts: userPosts.map((post) => ({
                id: post.id,
                title: post.title,
                body: post.body,
            })),
        };
    });

    console.timeEnd('mapUsersWithPostsAndComments');
    return result;
}

export function buildUsersWithCounts(users, posts, comments) {
    console.time('buildUsersWithCounts');
    const safeUsers = normalizeArray(users);
    const safePosts = normalizeArray(posts);
    const safeComments = normalizeArray(comments);

    const postsByUserId = groupBy(safePosts, (post) => post.userId);
    const commentsByPostId = groupBy(safeComments, (comment) => comment.postId);

    return safeUsers.map((user) => {
        const userPosts = postsByUserId[user.id] ?? [];
        const postsCount = userPosts.length;
        const commentsCount = userPosts.reduce((total, post) => {
            return total + (commentsByPostId[post.id]?.length ?? 0);
        }, 0);

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            commentsCount,
            postsCount,
        };
    });

    console.timeEnd('buildUsersWithCounts');
}

export function getTopByKey(items, key) {
    const safeItems = normalizeArray(items);
    if (safeItems.length === 0) {
        return [];
    }

    const listTop = [safeItems[0]];
    let topValue = safeItems[0][key];

    for (let index = 1; index < safeItems.length; index++) {
        const currentItem = safeItems[index];
        const currentValue = currentItem[key];

        if (currentValue > topValue) {
            topValue = currentValue;
            listTop.length = 0;
            listTop.push(currentItem);
        } else if (currentValue === topValue) {
            listTop.push(currentItem);
        }
    }

    return listTop;
}

export function sortByDesc(items, key) {
    return [...normalizeArray(items)].sort((leftItem, rightItem) => rightItem[key] - leftItem[key]);
}

export function buildMergedPostWithComments(post, comments) {
    const safePost = post ?? {};

    return {
        ...safePost,
        comments: normalizeArray(comments),
    };
}

export function filterUsersWithMoreThanComments(usersWithCounts, minimumComments) {
    return normalizeArray(usersWithCounts).filter((user) => user.commentsCount > minimumComments);
}

// xây 1 hàm groupBy để gom nhóm các phần tử của mảng theo 1 key nào đó, trả về object có key là giá trị của key đó và value là mảng các phần tử có cùng giá trị key đó
// Giải thích ngắn gọn về lựa chọn groupBy vs filter/find:
// - `filter` trả về tất cả phần tử thỏa điều kiện (mảng). Nếu bạn gọi `arr.filter(...)` trong một vòng lặp (ví dụ với mỗi user)
//   thì mỗi lần phải quét toàn bộ `arr` → O(n * q) (q = số lần tra cứu) — chậm với dữ liệu lớn.
// - `groupBy` xây một index (object/Map) trong 1 lần O(n), sau đó tra cứu theo key là O(1). Tổng chi phí ≈ O(n + q).
//   Vì vậy khi bạn cần gom/tra cứu nhiều lần (posts per user, comments per post) thì `groupBy` nhanh hơn nhiều.
// - Tradeoff: `groupBy` tốn thêm bộ nhớ để lưu index, nhưng thường chấp nhận được so với lợi ích hiệu năng.
//   Dùng `Map` khi key không phải string hoặc muốn an toàn hơn với prototype.
function groupBy(items, getKey) {
    const groups = Object.create(null);

    for (const item of items) {
        const key = String(getKey(item));
        const groupedItems = groups[key] ?? [];

        groupedItems.push(item);
        groups[key] = groupedItems;
    }
    return groups;
}

