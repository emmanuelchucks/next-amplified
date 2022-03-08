import { DataStore } from "aws-amplify";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Post, PostStatus } from "../models";
import styles from "../styles/Home.module.css";

async function handleCreatePost(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  try {
    const data = await DataStore.save(
      new Post({
        title: form.get("title"),
        content: form.get("content"),
        rating: Number(form.get("rating")),
        status: PostStatus.DRAFT,
      })
    );

    window.location.href = `/posts/${data.id}`;
  } catch (error) {
    console.error(error);
  }
}

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const subscription = DataStore.observeQuery(Post).subscribe(({ items }) =>
      setPosts(items)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Amplify + Next.js</h1>

        <p className={styles.description}>
          <code className={styles.code}>{posts.length}</code>
          posts
        </p>

        <div className={styles.grid}>
          {posts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <a className={styles.card}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>{post.rating}</p>
                <p>{post.status}</p>
              </a>
            </Link>
          ))}

          <div className={styles.card}>
            <h3 className={styles.title}>New Post</h3>

            <form onSubmit={handleCreatePost}>
              <fieldset>
                <legend>Title</legend>
                <input
                  defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                  name="title"
                />
              </fieldset>

              <fieldset>
                <legend>Content</legend>
                <textarea
                  defaultValue="I built an Amplify app with Next.js!"
                  name="content"
                />
              </fieldset>

              <fieldset>
                <legend>Rating</legend>
                <input type="number" defaultValue="5" name="rating" />
              </fieldset>

              <button>Create Post</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
