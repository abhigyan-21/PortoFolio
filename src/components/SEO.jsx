import { Helmet } from 'react-helmet-async'

const siteUrl = 'https://abhigyan-21.github.io/PortoFolio/'
const description = 'Interactive portfolio of Abhigyan Dutta, a software engineer building useful digital experiences and tools.'

function SEO() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abhigyan Dutta',
    email: 'mailto:abhigyandutta@yahoo.com',
    url: siteUrl,
    jobTitle: 'COMPUTER SCIENCE Engineer',
    sameAs: [
      'https://github.com/abhigyan-21',
      'https://www.linkedin.com/in/abhigyandutta/',
    ],
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>Abhigyan Dutta | Software Engineer Portfolio</title>
      <meta name="description" content={description} />
      <meta name="author" content="Abhigyan Dutta" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#091321" />
      <link rel="canonical" href={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content="Abhigyan Dutta | Software Engineer Portfolio" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={`${siteUrl}favicon.svg`} />
      <meta property="og:image:alt" content="Abhigyan Dutta portfolio logo" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Abhigyan Dutta | Software Engineer Portfolio" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}favicon.svg`} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  )
}

export default SEO
