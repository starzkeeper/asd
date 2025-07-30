import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Shield, Zap, Users, ArrowRight, Globe, TrendingUp, Clock } from 'lucide-react';
import { exchangeStore } from '@/lib/exchangeStore';
import { Logo } from '@/components/ui/logo';

export default function Index() {
  const navigate = useNavigate();
  const [fromAmount, setFromAmount] = useState('22000');
  const [usdtRate, setUsdtRate] = useState(478.5); // KZT per USDT

  // Fetch real USDT rate from API
  useEffect(() => {
    const fetchUsdtRate = async () => {
      try {
        // Using CoinGecko API to get USDT price in USD, then convert to KZT
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        const usdtPriceInUsd = data.tether.usd;

        // Approximate KZT/USD rate (you could also fetch this from another API)
        const kztPerUsd = 478.5;
        const kztPerUsdt = kztPerUsd * usdtPriceInUsd;

        setUsdtRate(kztPerUsdt);
      } catch (error) {
        console.error('Failed to fetch USDT rate:', error);
        // Keep default rate if API fails
      }
    };

    fetchUsdtRate();
    // Refresh rate every 30 seconds
    const interval = setInterval(fetchUsdtRate, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate USDT amount with beneficial rate structure
  const toAmount = useMemo(() => {
    const kztAmount = parseFloat(fromAmount) || 0;
    const usdAmount = kztAmount / 478.5; // Convert to USD for percentage calculation

    // Determine bonus percentage based on USD amount (user gets MORE)
    let bonusPercent = 0;
    if (usdAmount <= 1000) {
      bonusPercent = 2;
    } else if (usdAmount <= 3000) {
      bonusPercent = 2.2;
    } else if (usdAmount <= 5000) {
      bonusPercent = 2.3;
    } else if (usdAmount <= 10000) {
      bonusPercent = 2.5;
    } else {
      bonusPercent = 2.5; // For amounts over $10,000
    }

    // Calculate USDT amount with bonus rate (user gets MORE USDT)
    const baseUsdtAmount = kztAmount / usdtRate;
    const finalAmount = baseUsdtAmount * (1 + bonusPercent / 100);
    return finalAmount.toFixed(2);
  }, [fromAmount, usdtRate]);

  const [liveTrades, setLiveTrades] = useState(() => {
    const now = new Date();
    return [
      { id: 1, amount: '1,250.00', rate: '478.50', type: 'Покупка', time: new Date(now.getTime() - 30000).toLocaleTimeString() },
      { id: 2, amount: '850.75', rate: '478.52', type: 'Продажа', time: new Date(now.getTime() - 95000).toLocaleTimeString() },
      { id: 3, amount: '2,100.00', rate: '478.48', type: 'Покупка', time: new Date(now.getTime() - 180000).toLocaleTimeString() },
      { id: 4, amount: '675.25', rate: '478.51', type: 'Продажа', time: new Date(now.getTime() - 245000).toLocaleTimeString() },
      { id: 5, amount: '1,890.50', rate: '478.49', type: 'Покупка', time: new Date(now.getTime() - 320000).toLocaleTimeString() },
    ];
  });

  const generateRandomTrade = () => {
    const amounts = ['450.00', '1,250.75', '890.25', '2,150.00', '675.50', '1,340.25', '925.75', '1,680.00'];
    const rates = ['478.48', '478.49', '478.50', '478.51', '478.52', '478.47', '478.53'];
    const types = ['Покупка', 'Продажа'];

    return {
      id: Date.now() + Math.random(),
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      rate: rates[Math.floor(Math.random() * rates.length)],
      type: types[Math.floor(Math.random() * types.length)],
      time: new Date().toLocaleTimeString()
    };
  };

  useEffect(() => {
    const scheduleNextTrade = () => {
      const randomDelay = Math.random() * (13000 - 5000) + 5000; // 5-13 seconds

      setTimeout(() => {
        setLiveTrades(prevTrades => {
          const newTrade = generateRandomTrade();
          const updatedTrades = [newTrade, ...prevTrades.slice(0, 4)];
          return updatedTrades;
        });
        scheduleNextTrade(); // Schedule next trade
      }, randomDelay);
    };

    scheduleNextTrade();
  }, []);

  const testimonials = [
    {
      name: 'Александр К.',
      rating: 5,
      text: 'Отличный сервис для обмена криптовалют. Быстро, надежно и с хорошими курсами.'
    },
    {
      name: 'Мария П.',
      rating: 5,
      text: 'Пользуюсь уже полгода, все операции проходят без проблем. Рекомендую!'
    },
    {
      name: 'Дмитрий С.',
      rating: 5,
      text: 'Лучший обменник криптовалют в Казахстане. Поддержка всегда готова помочь.'
    }
  ];

  const handleExchange = () => {
    exchangeStore.setExchangeData({
      fromAmount,
      toAmount,
      exchangeRate: usdtRate
    });
    navigate('/exchange-confirm');
  };

  return (
    <div className="min-h-screen crypto-gradient">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size="lg" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                  ALMASU
                </span>
                <div className="text-xs text-muted-foreground">Обменник криптовалюты</div>
              </div>
            </div>
            
            <div className="modern-card px-3 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-foreground">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-yellow-100 to-primary bg-clip-text text-transparent">
                Быстрый обмен
              </span>
              <br />
              <span className="text-foreground">KZT ⟷ USDT</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Самые выгодные курсы и мгновенные переводы. 
              Безопасно, надежно, круглосуточно.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="modern-card px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Банковская безопасность</span>
              </div>
            </div>
            <div className="modern-card px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Мгновенно</span>
              </div>
            </div>
            <div className="modern-card px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">24/7 поддержка</span>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Exchange Form */}
            <div className="lg:col-span-3">
              <div className="exchange-card rounded-3xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Обмен валют</h2>
                  <p className="text-muted-foreground">Введите сумму для расчета курса</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Отдаете</label>
                    <div className="relative">
                      <Input
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        className="bg-background/50 border-border/50 text-foreground pr-16 h-14 text-lg font-medium"
                        placeholder="22000"
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        KZT
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="modern-card p-3 rounded-full">
                      <ArrowRight className="w-5 h-5 rotate-90 text-primary" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Получаете</label>
                    <div className="relative">
                      <div className="bg-background/30 border border-border/50 text-foreground h-14 px-4 py-2 rounded-md pr-20 flex items-center text-lg font-bold text-green-400">
                        {toAmount || '0.00'}
                      </div>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        USDT
                      </span>
                    </div>
                  </div>

                  {parseFloat(fromAmount) >= 22000 ? (
                    <Button
                      onClick={handleExchange}
                      className="w-full bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/90 hover:to-yellow-400/90 text-black font-bold py-4 text-lg rounded-xl h-auto shadow-lg shadow-primary/25"
                    >
                      НАЧАТЬ ОБМЕН
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-muted text-muted-foreground font-bold py-4 text-lg rounded-xl h-auto cursor-not-allowed"
                    >
                      НАЧАТЬ ОБМЕН
                    </Button>
                  )}

                  {parseFloat(fromAmount) < 22000 && fromAmount !== '' && (
                    <div className="text-center text-sm text-red-400">
                      Минимальная сумма для обмена: 22,000 KZT
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    Курс: 1 USDT = {usdtRate.toFixed(2)} KZT
                  </div>
                </div>
              </div>
            </div>

            {/* Live Trades */}
            <div className="lg:col-span-2">
              <div className="modern-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Сделки в реальном времени</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">LIVE</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {liveTrades.map((trade, index) => (
                    <div key={trade.id} className={`flex justify-between items-center p-3 rounded-xl transition-all duration-500 ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-background/30'}`}>
                      <div>
                        <div className="text-sm font-medium text-foreground">{trade.amount} USDT</div>
                        <div className="text-xs text-muted-foreground">{trade.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{trade.rate} ₸</div>
                        <div className={`text-xs ${trade.type === 'Покупка' ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8 text-center">
            <div className="modern-card rounded-3xl p-8">
              <div className="text-4xl font-bold text-primary mb-2">₸2М+</div>
              <div className="text-muted-foreground">Обменов в месяц</div>
            </div>
            <div className="modern-card rounded-3xl p-8">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Поддержка клиентов</div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="modern-card rounded-3xl p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed flex-grow">{testimonial.text}</p>
                <p className="text-muted-foreground font-medium">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/20 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo />
                <span className="text-xl font-semibold text-foreground">ALMASU</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Ведущий обменник криптовалюты
              </p>
              <p className="text-sm text-muted-foreground">
                Мы обеспечиваем надежные и быстрые услуги обмена цифровых активов с высочайшим уровнем безопасности.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Контакты</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="https://t.me/Serik_Maksat" className="hover:text-primary transition-colors">@Serik_Maksat</a></li>
                <li><a href="https://t.me/BelieveredST" className="hover:text-primary transition-colors">@BelieveredST</a></li>
                <li><a href="https://t.me/+lbkM7nFi0VcyMTNi" className="hover:text-primary transition-colors">Telegram группа</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/20 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ALMASU. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
