// import { fetchNews } from '@/lib/api';

// export default async function News() {
//   const news = await fetchNews();

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-4">Dance News</h1>
//       {news.map((article) => {
//         const descriptionText = article.Content?.[0]?.children?.[0]?.text || 'No content available';
//         const articleDate = article.Date ? new Date(article.Date).toLocaleDateString() : 'No Date';

//         return (
//           <div key={article.id} className="mb-4 p-4 border rounded shadow">
//             <h2 className="text-2xl font-semibold">{article.Title || 'No Title'}</h2>
//             <p>{descriptionText}</p>
//             <p>{articleDate}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
