import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Shield, Zap, Users, ArrowRight, Globe } from 'lucide-react';
import { exchangeStore } from '@/lib/exchangeStore';

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

  const features = [
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Банковская безопасность и современные методы шифрования данных'
    },
    {
      icon: Zap,
      title: 'Скорость',
      description: 'Мгновенные операции и быстрые переводы средств'
    },
    {
      icon: Users,
      title: 'Удобство',
      description: 'Простой и интуитивно понятный интерфейс для всех пользователей'
    }
  ];

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

  const partners = [
    { name: 'Bitcoin', logo: '₿' },
    { name: 'Ethereum', logo: 'Ξ' },
    { name: 'Tether', logo: '₮' },
    { name: 'QIWI', logo: 'Q' }
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
      <header className="border-b border-border/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-semibold text-foreground">ALMASU</span>
            </div>
            


            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-foreground">
                <Globe className="w-4 h-4 mr-2" />
                RU
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Exchange Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Конвертация KZT в Tether USDT
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Сдела��те быстрый обмен криптовалюты Tether USDT
              <br />
              На нашем сайте вы можете обменять KZT на 
              <br />
              Казахстанские тенге очень быстро, надежно и
              <br />
              ��ыгодно. Процесс обмена не отнимает у
              <br />
              вас много времени благодаря
              <br />
              автоматизированному обмену процессу.
            </p>
            <p className="text-primary font-medium mb-8">
              Самый выгодный курс обмена KZT в Tether USDT
            </p>

            <div className="card-gradient rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Отдаете</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        value={fromAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = parseFloat(value) || 0;
                          if (numValue >= 22000 || value === '') {
                            setFromAmount(value);
                          } else if (numValue < 22000 && numValue > 0) {
                            setFromAmount('22000');
                          }
                        }}
                        className="bg-input border-border text-foreground pr-16"
                        placeholder="22000"
                        min="22000"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        KZT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="sm" variant="ghost" className="p-2 rounded-full">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </Button>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Получаете</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <div className="bg-input border border-border text-foreground h-10 px-3 py-2 rounded-md pr-20 flex items-center">
                        {toAmount || '0.00'}
                      </div>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        USDT
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleExchange}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
                >
                  ОБМЕН
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Live USDT Trades */}
            <div className="card-gradient rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">Сделки USDT в реальном времени</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">LIVE</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20">
                      <th className="text-left py-2 text-muted-foreground">Сумма USDT</th>
                      <th className="text-right py-2 text-muted-foreground">Курс KZT</th>
                      <th className="text-right py-2 text-muted-foreground">Время</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {liveTrades.map((trade, index) => (
                      <tr key={trade.id} className={`transition-all duration-500 ${index === 0 ? 'bg-primary/5' : ''}`}>
                        <td className="py-2 text-foreground font-medium">{trade.amount} USDT</td>
                        <td className="py-2 text-right text-foreground">{trade.rate} ₸</td>
                        <td className="py-2 text-right text-muted-foreground text-xs">{trade.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Меняйте криптовалюты - 
              <br />
              быстро, выгодно, удобно!
            </h2>
            <p className="text-primary font-medium mb-12">
              Покупайте Tether USDT TRC-20
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Partners */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6">Наши партнеры</h3>
              <div className="flex justify-center items-center space-x-8">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-center justify-center w-16 h-16 bg-primary/10 border-2 border-dashed border-primary/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">LOGO</div>
                      <div className="text-xs text-muted-foreground">{index}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to={`/exchange-confirm?from=1000&to=${(1000 / 478.5 * (1 - 2 / 100)).toFixed(2)}`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-medium">
                ПЕРЕЙТИ К ОБМЕНУ
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Отзывы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-gradient rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">{testimonial.text}</p>
                <p className="text-muted-foreground font-medium">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="card-gradient rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">О Нас</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed mb-6">
              ALMASU - ведущая криптовалютная биржа в Казахстане, предоставляющая 
              надежные и быстрые услуги обмена цифровых активов. Мы обеспечиваем 
              высочайший уровень безопасности и удобства для наших клиентов.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">₸2М+</div>
                <div className="text-muted-foreground">Обменов в месяц</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Поддержка клиентов</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-semibold text-foreground">ALMASU</span>
              </div>
              <p className="text-muted-foreground">
                Ведущая криптовалютная биржа Казахстана
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
