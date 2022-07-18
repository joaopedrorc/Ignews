import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import { GetStaticProps } from 'next/types';
import { RichText } from 'prismic-dom';

import styles from './styles.module.scss';
import Link from 'next/link';

interface Post {
	slug: string;
	title: string;
	excerpt: string;
	updatedAt: string;
}

interface PostsProps {
	posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>

			<main className={styles.container}>
				<div className={styles.posts}>
					{posts.map((post) => (
						<Link key={post.slug} href={`/posts/${post.slug}`}>
							<a>
								<time>{post.updatedAt}</time>
								<strong>{post.title}</strong>
								<p>{post.excerpt}</p>
							</a>
						</Link>
					))}
				</div>
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const client = getPrismicClient();

	const response = await client.getAllByType('customPost', {
		fetch: ['Post.title', 'Post.content'],
		pageSize: 100,
	});

	const posts = response.map((post) => {
		return {
			slug: post.uid,
			title: RichText.asText(post.data.Title),
			excerpt:
				post.data.Content.find((content) => content.type === 'paragraph')
					?.text ?? '',
			updatedAt: new Date(post.last_publication_date).toLocaleDateString(
				'pt-BR',
				{
					day: '2-digit',
					month: 'long',
					year: 'numeric',
				}
			),
		};
	});

	return {
		props: { posts },
	};
};
