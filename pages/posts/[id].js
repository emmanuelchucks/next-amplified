import { DataStore } from "aws-amplify";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Post } from "../../models";
import styles from "../../styles/Home.module.css";

export default function PostPage() {
  const router = useRouter();
  const [post, setPost] = useState();

  useEffect(() => {
    const { id } = router.query;
    const subscription = DataStore.observeQuery(Post, (post) =>
      post.id("eq", id)
    ).subscribe(({ items }) => setPost(items[0]));
    return () => subscription.unsubscribe();
  }, [router.query]);

  async function handleDelete() {
    try {
      const postToDelete = await DataStore.query(Post, post.id);
      DataStore.delete(postToDelete);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post?.title} – Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{post?.title}</h1>

        <p className={styles.description}>{post?.content}</p>
        <p className={styles.description}>{post?.rating}</p>
        <p className={styles.description}>{post?.status}</p>
      </main>

      <footer className={styles.footer}>
        <button onClick={handleDelete}>💥 Delete post</button>
      </footer>
    </div>
  );
}
