import { fetchLegalPage } from '@/lib/api';
import Footer from '@/components/Footer';
import Navbar from '@/components/NavBar';
import AudioForm from '@/components/AudioForm';
import parse from 'html-react-parser';
import { getTranslations } from 'next-intl/server';
import CookieBanner from '@/components/CookieBanner';

// Render block as before
const renderBlock = (block, idx) => {
  const children = Array.isArray(block.children) ? block.children : [];

  if (block.type === 'paragraph') {
    const allEmpty = children.every((c) => !(c.text || '').trim());
    if (allEmpty) return <br key={`br-${idx}`} />;
    return (
      <p key={`paragraph-${idx}`} className="text-left">
        {children.map((c, j) => {
          const content = parse(c.text || '') || '';
          if (c.bold) return <strong key={`bold-${idx}-${j}`}>{content}</strong>;
          if (c.italic) return <em key={`italic-${idx}-${j}`}>{content}</em>;
          if (c.underline) return <u key={`underline-${idx}-${j}`}>{content}</u>;
          return <span key={`text-${idx}-${j}`}>{content}</span>;
        })}
      </p>
    );
  }

  if (block.type === 'list') {
    const ListTag = block.format === 'unordered' ? 'ul' : 'ol';
    const listClass =
      block.format === 'unordered'
        ? 'list-disc ml-6 text-left'
        : 'list-decimal ml-6 text-left';
    return (
      <ListTag key={`list-${idx}`} className={listClass}>
        {block.children.map((child, j) => renderBlock(child, `${idx}-${j}`))}
      </ListTag>
    );
  }

  if (block.type === 'list-item' || block.type === 'o-list-item') {
    const className =
      block.type === 'list-item'
        ? 'list-disc ml-6 text-left'
        : 'list-decimal ml-6 text-left';
    return (
      <li key={`${block.type}-${idx}`} className={className}>
        {children.map((c, j) => parse(c.text || ''))}
      </li>
    );
  }

  if (block.type === 'heading') {
    return (
      <h2 key={`heading-${idx}`} className="text-2xl font-semibold mt-6 text-center">
        {children.map((c, j) => parse(c.text || ''))}
      </h2>
    );
  }

  return (
    <div key={`default-${idx}`} className="text-left">
      {children.map((c, j) => parse(c.text || ''))}
    </div>
  );
};

export default async function PrivacyPolicyPage(props) {
  const params = await props.params;  
  const t = await getTranslations({ locale: params.locale, namespace: 'cookie' });
  const apiLocale = params.locale === 'el' ? 'el-GR' : params.locale;
  const policy = await fetchLegalPage('cookie-policy',apiLocale);
  if (!policy) return <div>{t('notFound')}</div>;

  return (
    <div className="bg-transparent min-h-screen text-white px-6 mt-20 mb-20 text-center">
      <Navbar />
      <AudioForm />
      <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20 flex flex-col items-center text-center">
        <h1 className="text-6xl py-16 font-bold text-center">
          {policy.title || t('title')}
        </h1>
        <section className="max-w-3xl w-full mx-auto mb-12 bg-black bg-opacity-50 rounded-lg shadow-xl p-8 text-left">
          {Array.isArray(policy.content)
            ? policy.content.map((block, i) => renderBlock(block, i))
            : <p>{t('noContent')}</p>
          }
        </section>
      </div>
      <CookieBanner />
      <Footer />
    </div>
  );
}
