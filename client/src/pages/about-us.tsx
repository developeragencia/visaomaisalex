import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VisaoLogo } from "@/components/logo";
import { Heart, Users, Target, Award, Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const testimonials = [
    {
      quote: "Assinei achando que era só mais uma promoção, mas fui surpreendido com o cuidado no atendimento e na escolha das lentes. Já indiquei para minha família inteira!",
      author: "Carla M.",
      location: "Gramado"
    },
    {
      quote: "Meu filho usa óculos e o plano me deu tranquilidade. Já trocamos as lentes sem custo. Vale cada centavo.",
      author: "Marcos P.",
      location: "Canela"
    },
    {
      quote: "Nunca fui de ir ao oftalmo todo ano. Agora faço o exame e troco meu óculos com qualidade. E tudo por R$49. É surreal.",
      author: "Denise A.",
      location: "cliente Visão+ desde o lançamento"
    }
  ];

  const faqs = [
    {
      question: "O que está incluso no plano Visão+?",
      answer: "Exame de vista completo 1x por ano, armação + lentes, troca de lentes (caso mude o grau) e garantia estendida."
    },
    {
      question: "Quanto custa o plano?",
      answer: "A partir de R$49/mês. Simples, sem taxas escondidas."
    },
    {
      question: "Posso cancelar quando quiser?",
      answer: "Sim. Você pode cancelar a qualquer momento sem multa."
    },
    {
      question: "Como faço o agendamento?",
      answer: "Pelo WhatsApp ou pelo nosso app (em breve!). Você escolhe a melhor data."
    },
    {
      question: "E se eu não usar no mês? Perco o benefício?",
      answer: "Não. O plano é anual e garante todos os benefícios, mesmo que você não use todo mês."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <VisaoLogo className="h-12" />
            <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
              Quero ser um assinante Visão+
            </Button>
          </div>
        </div>
      </header>

      {/* Nossa História Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-lg px-6 py-2">
              Quem Somos
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
              Nossa História
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Tudo começou com um casal que queria mudar o jeito como as pessoas cuidam da sua visão.
                </p>
                
                <p>
                  <strong className="text-purple-600">Jefferson e Eudaziany</strong>, fundadores do Visão+, 
                  sonhavam com algo maior do que uma ótica: <em>sonhavam com um plano visual acessível, 
                  recorrente e completo</em>, que combinasse tecnologia e cuidado humano.
                </p>
                
                <p>
                  Com a ajuda da inteligência artificial e a experiência prática de quem vive o dia a dia 
                  do atendimento, nasceu o <strong>Visão+</strong>: um modelo de assinatura inovador, 
                  com exame, óculos e acompanhamento incluídos, sem surpresas, sem burocracia.
                </p>
                
                <div className="bg-gradient-to-r from-purple-100 to-orange-100 p-6 rounded-lg">
                  <p className="text-xl font-semibold text-gray-900">
                    Hoje, o Visão+ é mais do que uma marca: <br />
                    <span className="bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                      é um movimento.
                    </span>
                  </p>
                  <p className="mt-4 text-lg">
                    E você também pode fazer parte dele.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-purple-400 to-orange-400 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Nossa Missão</h3>
                </div>
                <p className="text-lg mb-6">
                  Tornar o cuidado visual acessível, inovador e humanizado para todos os brasileiros.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1000+</div>
                    <div className="text-sm opacity-90">Clientes atendidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-sm opacity-90">Satisfação</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600">
              Os princípios que guiam cada decisão do Visão+
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Cuidado Humano",
                description: "Cada cliente é único e merece atenção personalizada"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Inovação",
                description: "Tecnologia a serviço de uma experiência melhor"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Qualidade",
                description: "Produtos e serviços de excelência, sempre"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="inline-flex p-4 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full text-purple-600 mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              O que dizem nossos clientes
            </h2>
            <p className="text-xl text-white/90">
              Histórias reais de quem já faz parte do movimento Visão+
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-purple-500 mb-4" />
                    <p className="text-gray-700 mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.location}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre o plano Visão+
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {index + 1}. {faq.question}
                    </h3>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Pronto para cuidar da sua visão?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a milhares de pessoas que já escolheram o Visão+ para cuidar da sua visão
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-lg px-8 py-4">
                Quero cuidar da minha visão por R$49/mês
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Falar com especialista
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}