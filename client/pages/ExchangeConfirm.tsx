import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Globe, CheckCircle } from "lucide-react";
import { exchangeStore } from "@/lib/exchangeStore";
import { Logo } from "@/components/ui/logo";

export default function ExchangeConfirm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [fromAmount, setFromAmount] = useState("22000");
  const [toAmount, setToAmount] = useState("46.01");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const exchangeData = exchangeStore.getExchangeData();
    if (exchangeData) {
      setFromAmount(exchangeData.fromAmount);
      setToAmount(exchangeData.toAmount);
      setExchangeRate(exchangeData.effectiveRate || exchangeData.exchangeRate);
      if (exchangeData.email) setEmail(exchangeData.email);
      if (exchangeData.walletAddress)
        setWalletAddress(exchangeData.walletAddress);
    } else {
      // Redirect to homepage if no exchange data
      navigate("/");
    }
  }, [navigate]);

  const handleConfirm = () => {
    exchangeStore.updateExchangeData({
      email,
      walletAddress,
    });
    navigate("/payment");
  };

  return (
    <div className="min-h-screen crypto-gradient">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <Logo size="lg" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                  ALMASU
                </span>
                <div className="text-xs text-muted-foreground">
                  Обменник криптовалюты
                </div>
              </div>
            </Link>

            <div className="modern-card px-3 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-foreground">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Link>

          {/* Exchange Confirmation */}
          <div className="exchange-card rounded-3xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
              Подтверждение обмена
            </h1>

            {/* Exchange Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div>
                  <div className="text-sm text-muted-foreground">Отдаете</div>
                  <div className="text-2xl font-bold text-foreground">
                    {fromAmount} KZT
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-primary mx-4" />
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Получаете</div>
                  <div className="text-2xl font-bold text-foreground">
                    {toAmount} USDT
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Курс обмена:</span>
                  <span className="text-foreground">
                    {exchangeRate ? `${exchangeRate.toFixed(2)} ₸` : "..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Комиссия:</span>
                  <span className="text-foreground">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Время обработки:
                  </span>
                  <span className="text-foreground">5-15 мин</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус:</span>
                  <span className="text-green-400">Активен</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-foreground">
                Контактная информация
              </h3>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Email адрес
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border text-foreground"
                  placeholder="example@mail.com"
                  type="email"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Кошелек USDT (TRC20) <span className="text-red-400">*</span>
                </label>
                <Input
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className={`bg-input border-border text-foreground ${
                    walletAddress.length === 0 ? "border-red-400/50" : ""
                  }`}
                  placeholder="TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
                  required
                />
                {walletAddress.length === 0 && (
                  <p className="text-red-400 text-xs mt-1">
                    Поле обязательно для заполнения
                  </p>
                )}
              </div>
            </div>

            {/* Agreement */}
            <div className="flex items-start space-x-3 mb-8">
              <input type="checkbox" className="mt-1" id="agreement" />
              <label
                htmlFor="agreement"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                Я согласен с условиями использования и политикой
                конфиденциальности
              </label>
            </div>

            {/* Confirm Button */}
            {walletAddress.trim() ? (
              <Button
                onClick={handleConfirm}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 text-lg"
              >
                Подтвердить обмен
              </Button>
            ) : (
              <Button
                disabled
                className="w-full bg-muted text-muted-foreground font-medium py-4 text-lg cursor-not-allowed"
              >
                Подтвердить обмен
              </Button>
            )}
          </div>

          {/* Security Notice */}
          <div className="modern-card rounded-3xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Безопасная сделка
            </h3>
            <p className="text-muted-foreground text-sm">
              Все операции защищены банковским шифрованием. Ваши данные в
              полной безопасности.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
