'use client';

import { useState } from 'react';
import { Search, Globe, Bookmark, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Category = 'All' | 'News' | 'Analysis' | 'Data & Charts' | 'Forums' | 'Education';

interface StockResource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: Category;
  keywords: string[];
}

const RESOURCES: StockResource[] = [
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com',
    description: 'Comprehensive financial news, data, and portfolio management tools.',
    category: 'News',
    keywords: ['news', 'quotes', 'portfolio', 'markets'],
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    description: 'Global business and financial news, market data, and insights.',
    category: 'News',
    keywords: ['news', 'global', 'markets', 'economy'],
  },
  {
    id: 'cnbc',
    name: 'CNBC',
    url: 'https://www.cnbc.com',
    description: 'Business news, financial information, and market data.',
    category: 'News',
    keywords: ['news', 'markets', 'video', 'interviews'],
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    url: 'https://www.tradingview.com',
    description: 'Advanced interactive financial charts and a social network for traders and investors.',
    category: 'Data & Charts',
    keywords: ['charts', 'social', 'analysis', 'crypto', 'forex'],
  },
  {
    id: 'finviz',
    name: 'Finviz',
    url: 'https://finviz.com',
    description: 'Stock screener and market visualization tools with charts and financial data.',
    category: 'Data & Charts',
    keywords: ['screener', 'maps', 'charts', 'data'],
  },
  {
    id: 'seeking-alpha',
    name: 'Seeking Alpha',
    url: 'https://seekingalpha.com',
    description: 'Crowdsourced stock market analysis, news, and investment ideas.',
    category: 'Analysis',
    keywords: ['analysis', 'articles', 'opinions', 'dividends'],
  },
  {
    id: 'motley-fool',
    name: 'The Motley Fool',
    url: 'https://www.fool.com',
    description: 'Stock investing advice, analysis, and recommendations aimed at long-term investors.',
    category: 'Analysis',
    keywords: ['advice', 'investing', 'growth', 'stocks'],
  },
  {
    id: 'investopedia',
    name: 'Investopedia',
    url: 'https://www.investopedia.com',
    description: 'Financial education, dictionary, and reference material for investing and finance.',
    category: 'Education',
    keywords: ['education', 'dictionary', 'learning', 'basics'],
  },
  {
    id: 'wsb',
    name: 'Reddit - WallStreetBets',
    url: 'https://www.reddit.com/r/wallstreetbets',
    description: 'A community for discussing highly speculative trading ideas and strategies.',
    category: 'Forums',
    keywords: ['forum', 'community', 'options', 'yolo', 'memes'],
  },
  {
    id: 'marketwatch',
    name: 'MarketWatch',
    url: 'https://www.marketwatch.com',
    description: 'Financial information, business news, analysis, and stock market data.',
    category: 'News',
    keywords: ['news', 'data', 'markets', 'economy'],
  },
];

const CATEGORIES: Category[] = ['All', 'News', 'Analysis', 'Data & Charts', 'Forums', 'Education'];

export default function NewsAndResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredResources = RESOURCES.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    
    if (!matchesCategory) return false;
    
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    
    const matchesName = resource.name.toLowerCase().includes(query);
    const matchesDesc = resource.description.toLowerCase().includes(query);
    const matchesKeywords = resource.keywords.some((kw) => kw.toLowerCase().includes(query));

    return matchesName || matchesDesc || matchesKeywords;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 relative">
       {/* Background gradient decorative effect */}
       <div className="fixed top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
       <div className="fixed bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
       
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center gap-4">
          <Globe className="h-10 w-10 md:h-12 md:w-12 text-primary drop-shadow-sm" />
          News & Resources
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
          Discover top websites for stock market news, analysis, charting tools, and community discussions. Filter, search, and access everything in one place.
        </p>
      </div>

      <div className="mb-10 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            type="text" 
            placeholder="Search by name, description, or keyword..." 
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base shadow-sm transition-all focus-visible:ring-primary/20 focus-visible:border-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full transition-all duration-300 shadow-sm hover:shadow-md px-5 py-5 text-sm font-medium ${selectedCategory !== category ? 'hover:border-primary/30 hover:bg-card bg-card/50 border-border/50' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-3xl bg-card/30 backdrop-blur-md shadow-sm border-border/50">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">No resources found</h3>
          <p className="text-muted-foreground max-w-md text-lg">
            We couldn't find any websites matching "{searchQuery}" in the {selectedCategory} category. Try adjusting your search filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-8 rounded-full h-12 px-8"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-border/40 bg-card/80 backdrop-blur-xl flex flex-col h-full rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="font-semibold px-3 py-1 bg-secondary/80 text-secondary-foreground shadow-sm rounded-lg">
                    {resource.category}
                  </Badge>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary/10"
                    aria-label={`Visit ${resource.name}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <CardTitle className="text-2xl mt-2 font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                  {resource.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow pb-6 px-6">
                <CardDescription className="text-base text-muted-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {resource.description}
                </CardDescription>
                <div className="mt-6 flex flex-wrap gap-2">
                  {resource.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/5 text-primary/80 border border-primary/10">
                      #{keyword}
                    </span>
                  ))}
                  {resource.keywords.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-muted-foreground/70">
                      +{resource.keywords.length - 3} more
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-6 px-6">
                <Button asChild className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm h-12 font-medium" variant="outline">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    Visit Website
                    <ExternalLink className="h-4 w-4 opacity-50 ml-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
