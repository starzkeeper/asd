import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Globe,
  TrendingUp,
  Clock,
} from "lucide-react";
import { exchangeStore } from "@/lib/exchangeStore";
import { Logo } from "@/components/ui/logo";

export default function Index() {
  const navigate = useNavigate();
  const [fromAmount, setFromAmount] = useState("22000");
  const [usdtRate, setUsdtRate] = useState<number | null>(null); // KZT per USDT (fetched from Coinbase)

  // Initialize trades with real rate
  const initializeTrades = (rate: number) => {
    const now = new Date();
    return [
      {
        id: 1,
        amount: "1,250.00",
        rate: rate.toFixed(2),
        type: "Покупка",
        time: new Date(now.getTime() - 30000).toLocaleTimeString(),
      },
      {
        id: 2,
        amount: "850.75",
        rate: (rate + (Math.random() - 0.5) * 0.2).toFixed(2),
        type: "Продажа",
        time: new Date(now.getTime() - 95000).toLocaleTimeString(),
      },
      {
        id: 3,
        amount: "2,100.00",
        rate: (rate + (Math.random() - 0.5) * 0.2).toFixed(2),
        type: "Покупка",
        time: new Date(now.getTime() - 180000).toLocaleTimeString(),
      },
      {
        id: 4,
        amount: "675.25",
        rate: (rate + (Math.random() - 0.5) * 0.2).toFixed(2),
        type: "Продажа",
        time: new Date(now.getTime() - 245000).toLocaleTimeString(),
      },
      {
        id: 5,
        amount: "1,890.50",
        rate: (rate + (Math.random() - 0.5) * 0.2).toFixed(2),
        type: "Покупка",
        time: new Date(now.getTime() - 320000).toLocaleTimeString(),
      },
    ];
  };

  // Fetch real USDT rate from API
  useEffect(() => {
    const fetchUsdtRate = async () => {
      try {
        // Request USDT → KZT rate directly from Coinbase
        const response = await fetch(
          "https://api.coinbase.com/v2/exchange-rates?currency=USDT",
        );
        const json = await response.json();
        const kztString = json?.data?.rates?.KZT;         // e.g. "478.12"
        const kztNumber = Number(kztString);

        if (!Number.isNaN(kztNumber) && kztNumber > 0) {
          setUsdtRate(kztNumber);
          // Initialize trades with real rate if this is the first load
          if (liveTrades.length === 0) {
            setLiveTrades(initializeTrades(kztNumber));
          }
        }
      } catch (error) {
        console.error("Failed to fetch USDT/KZT rate:", error);
        // keep previous usdtRate (null or last successful)
      }
    };

    fetchUsdtRate();
    // Refresh rate every 30 seconds
    const interval = setInterval(fetchUsdtRate, 300000);
    return () => clearInterval(interval);
  }, [liveTrades.length]);

  // Helper: bonus multiplier by USD tiers
  const markupMultiplier = (usd: number): number => {
    if (usd <= 1000)   return 1.02;   // +2%
    if (usd <= 3000)   return 1.022;  // +2.2%
    if (usd <= 5000)   return 1.023;  // +2.3%
    if (usd <= 10000)  return 1.025;  // +2.5%
    return 1.025;                     // > 10 000 USD
  };

  // Calculate USDT amount with beneficial rate structure
  // Calculate how many USDT the client receives (with bonus)
  const toAmount = useMemo(() => {
    if (!usdtRate) return "…";

    const kztAmount = parseFloat(fromAmount) || 0;
    const usdAmount = kztAmount / usdtRate;        // ≈ USD
    const multiplier = markupMultiplier(usdAmount);

    const baseUsdt    = kztAmount / usdtRate;
    const finalUsdt   = baseUsdt * multiplier;

    return finalUsdt.toFixed(2);
  }, [fromAmount, usdtRate]);

  // Effective rate after applying bonus (shown in UI)
  const effectiveRate = useMemo(() => {
    if (!usdtRate) return null;

    const kztAmount = parseFloat(fromAmount) || 0;
    const usdAmount = kztAmount / usdtRate;
    const multiplier = markupMultiplier(usdAmount);

    return usdtRate / multiplier;                 // lower KZT per 1 USDT
  }, [fromAmount, usdtRate]);

  // Percentage deduction to display next to the received amount
  const deductionPercent = useMemo(() => {
    if (!usdtRate) return null;

    const kztAmount = parseFloat(fromAmount) || 0;
    const usdAmount = kztAmount / usdtRate;
    const multiplier = markupMultiplier(usdAmount);          // 1.02 … 1.025
    const percent = (multiplier - 1) * 100;                  // 2 … 2.5

    return percent.toFixed(1).replace(/\.0$/, '');
  }, [fromAmount, usdtRate]);

  const [liveTrades, setLiveTrades] = useState(() => {
    const now = new Date();
    return [];
  });

  const generateRandomTrade = () => {
    const amounts = [
      "450.00",
      "1,250.75",
      "890.25",
      "2,150.00",
      "675.50",
      "1,340.25",
      "925.75",
      "1,680.00",
    ];
    const types = ["Покупка", "Продажа"];

    // Use real USDT rate with small random variations
    const baseRate = usdtRate || 478.50;
    const variation = (Math.random() - 0.5) * 0.1; // ±0.05 variation
    const tradeRate = baseRate + variation;

    return {
      id: Date.now() + Math.random(),
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      rate: tradeRate.toFixed(2),
      type: types[Math.floor(Math.random() * types.length)],
      time: new Date().toLocaleTimeString(),
    };
  };

  useEffect(() => {
    const scheduleNextTrade = () => {
      const randomDelay = Math.random() * (13000 - 5000) + 5000; // 5-13 seconds

      setTimeout(() => {
        setLiveTrades((prevTrades) => {
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
      name: "Александр К.",
      rating: 5,
      text: "Отличный сервис дл�� обмена криптовалют. Быстро, надежно и с хорошими курсами.",
    },
    {
      name: "Мария П.",
      rating: 5,
      text: "Пользуюсь уже полгода, все операции проходят без проблем. Рекомендую!",
    },
    {
      name: "Дмитрий С.",
      rating: 5,
      text: "Лучший обменник криптовалют в Казахстане. Поддержка всегда готова помочь.",
    },
  ];

  const handleExchange = () => {
    exchangeStore.setExchangeData({
      fromAmount,
      toAmount,
      exchangeRate: usdtRate,
      effectiveRate: effectiveRate,
    });
    navigate("/exchange-confirm");
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
                <div className="text-xs text-muted-foreground">
                  Обменник криптовалюты
                </div>
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
              Самые выгодные курсы и мгновенные переводы. Безопасно, надежно,
              круглосуточно.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="modern-card px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">
                  Банковская безопасность
                </span>
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
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Обмен валют
                  </h2>
                  <p className="text-muted-foreground">
                    Введите сумму для расчета курса
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Отдаете
                    </label>
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
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                      Получаете
                    </label>
                    <div className="relative">
                      <div className="bg-background/30 border border-border/50 text-foreground h-14 px-4 py-2 rounded-md pr-20 flex items-center text-lg font-bold text-green-400">
                        {toAmount || "0.00"}
                        {deductionPercent && (
                          <span className="text-sm text-green-500 ml-2">(+{deductionPercent}%)</span>
                        )}
                      </div>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        USDT
                      </span>
                    </div>
                  </div>

                  {parseFloat(fromAmount) >= 22000 && usdtRate ? (
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

                  {parseFloat(fromAmount) < 22000 && fromAmount !== "" && (
                    <div className="text-center text-sm text-red-400">
                      Минимальная сумма для обмена: 22,000 KZT
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-background/30 rounded-xl border border-primary/20">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Текущий курс USDT:</span>
                      <span className="font-medium text-foreground">
                        {usdtRate ? `${usdtRate.toFixed(2)} ₸` : "Загружается..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ваш курс с бонусом:</span>
                      <span className="font-bold text-primary">
                        {effectiveRate ? `${effectiveRate.toFixed(2)} ₸` : "—"}
                        {deductionPercent && (
                          <span className="text-sm text-green-500 ml-2">(+{deductionPercent}%)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <ul className="text-sm text-muted-foreground space-y-1 mt-4 list-disc list-inside">
                    <li>До 1000&nbsp;$&nbsp;&nbsp;<span className="text-green-500">+2%</span></li>
                    <li>От 1000$ до 3000$&nbsp;&nbsp;<span className="text-green-500">+2,2%</span></li>
                    <li>От 3000$ до 5000$&nbsp;&nbsp;<span className="text-green-500">+2,3%</span></li>
                    <li>От 5000$ до 10&nbsp;000$&nbsp;&nbsp;<span className="text-green-500">+2,5%</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Live Trades */}
            <div className="lg:col-span-2">
              <div className="modern-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Сделки в реальном времени
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">LIVE</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {liveTrades.map((trade, index) => (
                    <div
                      key={trade.id}
                      className={`flex justify-between items-center p-3 rounded-xl transition-all duration-500 ${index === 0 ? "bg-primary/10 border border-primary/20" : "bg-background/30"}`}
                    >
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {trade.amount} USDT
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {trade.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {trade.rate} ₸
                        </div>
                        <div
                          className={`text-xs ${trade.type === "Покупка" ? "text-green-400" : "text-red-400"}`}
                        >
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
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Отзывы клиентов
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="modern-card rounded-3xl p-6 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed flex-grow">
                  {testimonial.text}
                </p>
                <p className="text-muted-foreground font-medium">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Наши партнеры
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="modern-card rounded-2xl p-6 w-full h-24 flex items-center justify-center group hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors">
                BINANCE
              </div>
            </div>
            <div className="modern-card rounded-2xl p-6 w-full h-24 flex items-center justify-center group hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors">
                BYBIT
              </div>
            </div>
            <div className="modern-card rounded-2xl p-6 w-full h-24 flex items-center justify-center group hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors">
                KUCOIN
              </div>
            </div>
            <div className="modern-card rounded-2xl p-6 w-full h-24 flex items-center justify-center group hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors">
                HUOBI
              </div>
            </div>
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
                <span className="text-xl font-semibold text-foreground">
                  ALMASU
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Ведущий обменник криптовалюты
              </p>
              <p className="text-sm text-muted-foreground">
                Мы обеспечиваем надежные и быстрые услуги обмена цифровых
                активов с высочайшим уровнем безопасности.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Контакты</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="https://t.me/Serik_Maksat"
                    className="hover:text-primary transition-colors"
                  >
                    @Serik_Maksat
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/BelieveredST"
                    className="hover:text-primary transition-colors"
                  >
                    @BelieveredST
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/+lbkM7nFi0VcyMTNi"
                    className="hover:text-primary transition-colors"
                  >
                    Telegram группа
                  </a>
                </li>
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
