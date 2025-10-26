import React from 'react';

export type PostCardProps = {
  title: string;
  excerpt: string;
  author?: string;
  publishedOn?: string;
};

const PostCard: React.FC<PostCardProps> = ({ title, excerpt, author, publishedOn }) => {
  return (
    <article className="post-card">
      <h2>{title}</h2>
      <p>{excerpt}</p>
      {(author || publishedOn) && (
        <footer>
          {author && <span>By {author}</span>}
          {publishedOn && <span>{publishedOn}</span>}
        </footer>
      )}
    </article>
  );
};

export default PostCard;
