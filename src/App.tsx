import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  MessageSquare,
  ArrowRight,
  Send,
  Calendar,
  User,
  ExternalLink,
  MapPin,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  Crown,
  Award,
  Zap
} from "lucide-react";

// Número comercial oficial Solution Place Blindagem
const WHATSAPP_NUMBER = "5521996958082";
const DISPLAY_PHONE = "(21) 99695-8082";

interface FormData {
  nome: string;
  telefone: string;
  marca: string;
  modelo: string;
  veiculo: string;
  ano: string;
  aceitePrivacidade: boolean;
}

// Galeria exclusiva de veículos reais blindados (somente carros)
const vehicleGallery = [
  {
    src: "/solution-place/veiculos/IMG_550120241205.webp",
    title: "Range Rover Defender",
    tag: "Jaguar Land Rover Homologado",
  },
  {
    src: "/solution-place/veiculos/IMG_548720241205.webp",
    title: "Showroom Boutique Solution",
    tag: "Barra da Tijuca • RJ",
  },
  {
    src: "/solution-place/veiculos/IMG_468520260924.webp",
    title: "Porsche Cayenne",
    tag: "Alta Performance & Nível III-A",
  },
  {
    src: "/solution-place/veiculos/IMG_474120260924.webp",
    title: "Land Rover Discovery",
    tag: "Certificação de Fábrica",
  },
  {
    src: "/solution-place/veiculos/IMG_532620261019.webp",
    title: "BMW X5 M Sport",
    tag: "Tecnologia Ultraleve",
  },
  {
    src: "/solution-place/veiculos/IMG_6946.webp",
    title: "Vidros Balísticos de Alta Clareza",
    tag: "Anti-delaminação Prolongada",
  },
  {
    src: "/solution-place/veiculos/IMG_738720241206.webp",
    title: "SUV de Luxo Blindado",
    tag: "Acabamento Cirúrgico",
  },
  {
    src: "/solution-place/veiculos/IMG_136720260721.webp",
    title: "Entrega Técnica VIP",
    tag: "Inspeção de 120 Pontos",
  },
  {
    src: "/solution-place/veiculos/IMG_192420260729.webp",
    title: "Veículo Híbrido / Elétrico",
    tag: "Autonomia 100% Preservada",
  },
  {
    src: "/solution-place/veiculos/IMG_020420261019.webp",
    title: "Interior & Tapeçaria Original",
    tag: "Sem Ruídos & Sem Costura",
  },
];

// Catálogo de Marcas e seus Modelos mais cotados para blindagem de luxo
const vehicleCatalog = [
  {
    brand: "Land Rover",
    models: ["Defender 110", "Defender 90", "Range Rover Sport", "Range Rover Vogue", "Discovery", "Velar", "Evoque"],
  },
  {
    brand: "Porsche",
    models: ["Cayenne", "Macan", "Panamera", "Taycan", "911"],
  },
  {
    brand: "BMW",
    models: ["X5", "X3", "X6", "X1", "320i", "Série 5", "iX"],
  },
  {
    brand: "Mercedes-Benz",
    models: ["GLE", "GLC", "GLS", "Classe C", "Classe G", "Classe E", "EQA / EQB / EQE"],
  },
  {
    brand: "Volvo",
    models: ["XC90", "XC60", "XC40", "EX30", "EX90"],
  },
  {
    brand: "BYD / GWM",
    models: ["BYD Song Plus", "BYD Seal", "BYD Tan", "BYD Yuan Plus", "Haval H6", "Tank 300"],
  },
  {
    brand: "Jaguar",
    models: ["F-Pace", "E-Pace", "I-Pace"],
  },
  {
    brand: "Audi",
    models: ["Q8", "Q7", "Q5", "Q3", "A3 / A4 / A5", "e-tron"],
  },
];

export default function SolutionPlaceLanding() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    telefone: "",
    marca: "",
    modelo: "",
    veiculo: "",
    ano: "",
    aceitePrivacidade: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Identifica o catálogo da marca selecionada
  const activeBrandCatalog = vehicleCatalog.find(
    (b) => b.brand.toLowerCase() === formData.marca.trim().toLowerCase()
  );

  const handleMarcaSelect = (brandName: string) => {
    setFormData((prev) => ({
      ...prev,
      marca: brandName,
      veiculo: prev.modelo ? `${brandName} ${prev.modelo}`.trim() : brandName,
    }));
    if (formErrors.marca) {
      setFormErrors((prev) => ({ ...prev, marca: "" }));
    }
  };

  const handleModeloSelect = (modelName: string) => {
    setFormData((prev) => ({
      ...prev,
      modelo: modelName,
      veiculo: prev.marca ? `${prev.marca} ${modelName}`.trim() : modelName,
    }));
    if (formErrors.modelo) {
      setFormErrors((prev) => ({ ...prev, modelo: "" }));
    }
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<FormData | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<{ src: string; title: string; tag: string } | null>(null);
  
  // Estados do Carrossel 3D Coverflow com interpolação contínua e fluida
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  // Otimização Dinâmica de SEO & Favicon Oficial da Solution Place Blindagem
  useEffect(() => {
    // Salvar metadados originais
    const originalTitle = document.title;
    const faviconElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    const originalFavicon = faviconElement ? faviconElement.href : "/favicon.png";

    // Definir título e favicon oficial da Solution Place
    document.title = "Solution Place Blindagem | Primeira Blindadora Boutique do Mundo | Rio de Janeiro";

    const updateFavicon = (href: string) => {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.type = "image/png";
      link.href = href;
    };

    updateFavicon("/solution-place/favicon-contrast-32.png");

    // Adicionar / atualizar meta tags de SEO dinâmicas
    const metaTags: { [key: string]: string } = {
      description: "Solution Place Blindagem - Primeira Blindadora Boutique do Mundo. Única carioca certificada de fábrica Land Rover e blindadora oficial Motor Group Brasil.",
      keywords: "blindagem rio de janeiro, blindadora rj, solution place blindagem, blindagem land rover, blindadora boutique, renato reis blindagem, blindagem nivel 3a",
      "og:title": "Solution Place Blindagem | Primeira Blindadora Boutique do Mundo",
      "og:description": "Única carioca certificada de fábrica Land Rover. Blindadora oficial Motor Group Brasil. Atendimento exclusivo e engenharia balística de excelência.",
      "og:image": `${window.location.origin}/solution-place/Site-SOLUTION-att_01-1.webp`,
      "og:url": window.location.href,
      "og:site_name": "Solution Place Blindagem",
      "twitter:title": "Solution Place Blindagem | Primeira Blindadora Boutique",
      "twitter:description": "Única carioca certificada de fábrica Land Rover. Blindadora oficial Motor Group Brasil.",
      "twitter:image": `${window.location.origin}/solution-place/Site-SOLUTION-att_01-1.webp`,
    };

    const createdElements: HTMLElement[] = [];

    Object.entries(metaTags).forEach(([key, value]) => {
      let tag = document.querySelector(`meta[name="${key}"], meta[property="${key}"]`) as HTMLMetaElement | null;
      if (tag) {
        tag.setAttribute("content", value);
      } else {
        tag = document.createElement("meta");
        if (key.startsWith("og:")) {
          tag.setAttribute("property", key);
        } else {
          tag.setAttribute("name", key);
        }
        tag.setAttribute("content", value);
        document.head.appendChild(tag);
        createdElements.push(tag);
      }
    });

    // Injetar dados estruturados JSON-LD Schema.org para o Google
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AutoBodyShop",
      "name": "Solution Place Blindagem",
      "alternateName": "Solution Place Blindagens",
      "description": "Primeira Blindadora Boutique do Mundo, única carioca certificada de fábrica Land Rover e blindadora oficial Motor Group Brasil.",
      "url": "https://solutionplaceblindagem.com.br",
      "logo": `${window.location.origin}/solution-place/Logo-Solution-branco.webp`,
      "image": `${window.location.origin}/solution-place/Site-SOLUTION-att_01-1.webp`,
      "telephone": "+5521996958082",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rio de Janeiro",
        "addressRegion": "RJ",
        "addressCountry": "BR"
      },
      "founder": {
        "@type": "Person",
        "name": "Renato Reis"
      },
      "sameAs": [
        "https://www.instagram.com/solutionplaceblindagem/",
        "https://www.youtube.com/@SolutionPlaceBlindagem"
      ]
    });
    document.head.appendChild(schemaScript);
    createdElements.push(schemaScript);

    return () => {
      document.title = originalTitle;
      updateFavicon(originalFavicon);
      createdElements.forEach(el => el.remove());
    };
  }, []);

  // Auto-play do carrossel (a cada 3,5 segundos quando não em hover ou arrasto)
  useEffect(() => {
    if (isGalleryHovered || isDragging) return;
    const interval = setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % vehicleGallery.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGalleryHovered, isDragging]);

  // Controles unificados de arraste / swipe (touch e pointer fluido)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Apenas clique principal ou touch
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    isPointerDown.current = true;
    hasDragged.current = false;
    isHorizontalSwipe.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;

    // Detecta se a intenção inicial é deslizar horizontalmente ou scrollar verticalmente
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          isHorizontalSwipe.current = true;
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch {}
        } else {
          isHorizontalSwipe.current = false;
        }
      }
    }

    if (isHorizontalSwipe.current === true) {
      hasDragged.current = true;
      setIsDragging(true);
      setDragOffset(deltaX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (isHorizontalSwipe.current === true) {
      if (dragOffset > 40) {
        setActiveGalleryIndex((prev) => (prev - 1 + vehicleGallery.length) % vehicleGallery.length);
      } else if (dragOffset < -40) {
        setActiveGalleryIndex((prev) => (prev + 1) % vehicleGallery.length);
      }
    }

    setDragOffset(0);
    isHorizontalSwipe.current = null;
    setTimeout(() => {
      hasDragged.current = false;
    }, 80);
  };

  const handleCardClick = (idx: number, diff: number) => {
    if (hasDragged.current) return;
    if (diff === 0) {
      setSelectedGalleryImage(vehicleGallery[idx]);
    } else {
      setActiveGalleryIndex(idx);
    }
  };

  useEffect(() => {
    document.title = "Solution Place Blindagem | Primeira Blindadora Boutique do Mundo";
    window.scrollTo(0, 0);
  }, []);

  // Máscara dinâmica de telefone brasileiro (DDD + 9 dígitos)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 11) raw = raw.slice(0, 11);

    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }

    setFormData((prev) => ({ ...prev, telefone: formatted }));
    if (formErrors.telefone) {
      setFormErrors((prev) => ({ ...prev, telefone: "" }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.nome.trim()) {
      errors.nome = "Por favor, informe seu nome completo.";
    }
    const cleanPhone = formData.telefone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.telefone = "Informe um WhatsApp válido com DDD (ex: 21 99999-9999).";
    }
    if (!formData.marca.trim()) {
      errors.marca = "Por favor, selecione ou digite a marca do veículo.";
    }
    const modeloTrim = formData.modelo.trim();
    if (!modeloTrim) {
      errors.modelo = "Por favor, selecione ou digite o modelo do veículo.";
    } else if (modeloTrim.length < 2) {
      errors.modelo = "Por favor, informe o modelo completo (ex: Defender 110, X5, Cayenne) para enviarmos o orçamento.";
    }
    if (!formData.ano.trim()) {
      errors.ano = "Selecione ou digite o ano do veículo.";
    }
    if (!formData.aceitePrivacidade) {
      errors.privacidade = "É necessário concordar com os termos de privacidade para iniciar seu atendimento.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateWhatsAppUrl = (data: FormData) => {
    const marca = data.marca.trim();
    const modelo = data.modelo.trim();
    const text = 
      `*Olá! Seja bem-vindo(a) à Solution Place Blindagem.*\n` +
      `Gostaria de iniciar meu atendimento exclusivo de blindagem boutique.\n\n` +
      `📋 *Ficha Técnica do Lead:*\n` +
      `👤 *Nome:* ${data.nome.trim()}\n` +
      `📱 *WhatsApp:* ${data.telefone.trim()}\n` +
      `🏷️ *Marca:* ${marca}\n` +
      `🚗 *Modelo:* ${modelo}\n` +
      `📅 *Ano do Veículo:* ${data.ano.trim()}\n\n` +
      `_Enviado através da Landing Page Oficial Solution Place Blindagem._`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorElement = document.getElementById("lead-form-card");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    // Identificador único de evento para desduplicação perfeita entre Navegador (Pixel) e Servidor (CAPI)
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nameParts = formData.nome.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const cleanPhone = formData.telefone.replace(/\D/g, "");

    // 1. Disparo no Navegador (Meta Pixel)
    if (typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq(
          "track",
          "Lead",
          {
            content_name: formData.veiculo,
            content_category: formData.ano,
            value: 0,
            currency: "BRL",
          },
          { eventID: eventId }
        );
      } catch (err) {
        console.error("Erro ao disparar Meta Pixel:", err);
      }
    }

    // 2. Disparo no Servidor (Meta Conversions API - CAPI)
    try {
      fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "Lead",
          event_id: eventId,
          user_data: {
            first_name: firstName,
            last_name: lastName,
            phone: cleanPhone,
          },
          custom_data: {
            content_name: formData.veiculo,
            content_category: formData.ano,
          },
          event_source_url: window.location.href,
        }),
      }).catch((capiErr) => console.error("Erro CAPI:", capiErr));
    } catch {
      // Ignora erro assíncrono para não interromper a conversão do usuário
    }

    // 3. Envio ao CRM do KrM Ads (via função serverless /api/lead)
    try {
      const params = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach((k) => {
        const v = params.get(k);
        if (v) utm[k] = v;
      });
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          nome: formData.nome.trim(),
          telefone: cleanPhone,
          veiculo: formData.veiculo,
          ano: formData.ano,
          utm,
          pagina: window.location.origin + window.location.pathname,
        }),
      }).catch((crmErr) => console.error("Erro CRM:", crmErr));
    } catch {
      // Não bloqueia a conversão do usuário
    }

    // Salva histórico de lead no navegador
    try {
      const stored = localStorage.getItem("solution_place_leads");
      const list = stored ? JSON.parse(stored) : [];
      list.push({ ...formData, dataEnvio: new Date().toISOString() });
      localStorage.setItem("solution_place_leads", JSON.stringify(list));
    } catch {
      // Ignora erro de storage local
    }

    setLastSubmittedLead({ ...formData });
    setIsSubmitted(true);

    const waUrl = generateWhatsAppUrl(formData);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const scrollToForm = () => {
    const formEl = document.getElementById("lead-form-card");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const quickVehicleOptions = [
    "Land Rover",
    "Jaguar",
    "Porsche",
    "BMW",
    "Mercedes-Benz",
    "Volvo",
    "Audi",
    "BYD / GWM",
  ];

  const quickYearOptions = [
    "0km / 2026",
    "2025",
    "2024",
    "2023",
    "2022 ou anterior",
  ];

  const faqs = [
    {
      q: "A blindagem Solution Place preserva a garantia de fábrica do veículo?",
      a: "Sim. A Solution Place é a única blindadora carioca certificada de fábrica Jaguar Land Rover e blindadora oficial Motor Group Brasil, além de homologada pelas principais redes concessionárias do Rio de Janeiro. Todos os protocolos de desmontagem, cabeamento e remontagem mantêm a garantia original de montadora."
    },
    {
      q: "O que é o conceito de Blindadora Boutique?",
      a: "Diferente de linhas industriais em massa, o conceito Boutique da Solution Place foi pioneiro no mundo: cada projeto recebe tratamento artesanal milimétrico, controle de qualidade individualizado e acabamento de altíssimo padrão, sem deixar costuras aparentes, sem ruídos e preservando 100% da dirigibilidade e luxo original."
    },
    {
      q: "Qual é o nível balístico e a certificação militar?",
      a: "Utilizamos proteção balística Nível III-A rigorosamente testada, auditada e autorizada pelo Exército Brasileiro, com total proteção contra armas de fogo portáteis (como 9mm, .40, .45 e .44 Magnum) com máxima retenção e vidros balísticos de alta tecnologia."
    },
    {
      q: "Qual a localização da fábrica boutique no Rio de Janeiro?",
      a: "Nossa sede e ateliê boutique estão estrategicamente localizados na Estrada da Barra da Tijuca, nº 465 - Barra da Tijuca, Rio de Janeiro - RJ, com estrutura completa de recepção, ateliê de engenharia e showroom."
    },
    {
      q: "Como funciona a documentação junto ao Exército e Detran-RJ?",
      a: "Nossa assessoria técnica e jurídica gerencia todos os trâmites burocráticos: da solicitação prévia ao Exército Brasileiro até a regularização e inclusão do termo de blindagem no documento (CRLV) do Detran-RJ."
    }
  ];

  return (
    <div className="solution-place-root min-h-screen bg-[#000000] text-white selection:bg-[#FF0D0D]/30 selection:text-white pb-24 md:pb-12">
      {/* Importação e aplicação global da Fonte Poppins da Solution Place */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&display=swap');
        
        .solution-place-root,
        .solution-place-root * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .official-red-button {
          animation: 3.4s cubic-bezier(0.2, 0.5, 0.9, 0.6) 2s infinite normal none running textura;
          background-image: linear-gradient(45deg, #FF0D0D, #320A0A, #FF0D0D, #320A0A);
          background-size: 400% 200%;
          transition: background 1.6s cubic-bezier(0.55, 0.1, 0.47, 0.94) 0s;
        }

        @keyframes textura {
          0% { background-position: 0 0; }
          100% { background-position: 100% 0; }
        }

        .solution-red-button {
          background-image: linear-gradient(45deg, #FF0D0D, #4A0808, #FF0D0D);
          background-size: 250% 200%;
          transition: all 0.4s ease;
        }
        .solution-red-button:hover {
          background-position: right center;
          box-shadow: 0 0 25px rgba(255, 13, 13, 0.45);
        }
      `}</style>

      {/* HEADER BOUTIQUE - IDENTIDADE EXATA SOLUTION PLACE (Apenas no Desktop/Tablet; Oculto no Mobile como no site oficial) */}
      <header className="hidden sm:block sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-zinc-900 px-4 py-3 sm:py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo Oficial Solution Place */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src="/solution-place/Logo-Solution-branco.webp"
                alt="Solution Place Blindagem"
                className="h-8 sm:h-10 w-auto object-contain filter drop-shadow group-hover:opacity-90 transition-opacity"
              />
            </a>
          </div>

          {/* Badges e Contato Direto */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF0D0D]">
                Primeira Blindadora Boutique do Mundo
              </span>
              <span className="text-xs text-zinc-400 font-normal">Barra da Tijuca • Rio de Janeiro</span>
            </div>

            <button
              onClick={scrollToForm}
              className="solution-red-button px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Solicitar Atendimento</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION OFICIAL: RENATO REIS TOTALMENTE INTEGRADO À PÁGINA COM TEXTOS REAIS */}
      <section className="relative bg-black overflow-hidden border-b border-zinc-900 min-h-0 md:min-h-[520px] lg:min-h-[560px]">
        
        {/* Background Desktop (>= 768px): Arte Oficial com Carro + Sr. Renato Reis posicionado com precisão (ancorado no topo para não cortar a cabeça) */}
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/solution-place/Site-SOLUTION-att_01-1.webp')",
            backgroundPosition: "top right",
          }}
        >
          {/* Gradiente sutil à esquerda para assegurar legibilidade absoluta da tipografia */}
          <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-black via-black/85 to-transparent" />
        </div>

        {/* Versão Mobile (< 768px): Fundo idêntico ao Elementor oficial (3333333333333333.jpg) */}
        <div 
          className="md:hidden absolute inset-0 bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/solution-place/hero-official-mobile.webp')",
            backgroundPosition: "top 5% right -20px",
            backgroundSize: "cover",
          }}
        >
          {/* Gradiente lateral proporcional para garantir contraste exatamente como no oficial */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Conteúdo Institucional com Textos, Logos e Ações Reais - Alinhamento Centralizado e Balanceado */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 pt-5 pb-5 sm:pt-7 sm:pb-7 md:py-12 lg:py-16 relative z-10">
          <div className="max-w-[280px] sm:max-w-[340px] md:max-w-xl lg:max-w-2xl space-y-3.5 md:space-y-4 text-left ml-2 sm:ml-4 md:ml-6">
            
            {/* Logo Oficial com Asas - Tamanho idêntico ao site oficial (100px no mobile e tablet, 200px desktop) */}
            <div className="flex justify-start">
              <img
                src="/solution-place/Logo-Solution-branco.webp"
                alt="Solution Place Blindagem"
                className="w-[100px] sm:w-[110px] md:w-52 lg:w-56 h-auto object-contain filter drop-shadow-md"
              />
            </div>

            {/* Título Oficial Exato - Poppins SemiBold (600) */}
            <h1 className="text-[15px] sm:text-[18px] md:text-2xl lg:text-[28px] font-semibold uppercase text-white leading-snug tracking-tight">
              Primeira Blindadora Boutique do Mundo
            </h1>

            {/* Subtítulo Oficial */}
            <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
              Proteção balística de alta performance para veículos premium.
            </p>

            {/* Ação Principal: Rolar para o Formulário de Qualificação */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 pt-1 sm:pt-2">
              <button
                onClick={scrollToForm}
                className="w-auto official-red-button py-3 md:py-3.5 px-6 md:px-8 rounded-lg text-[13px] md:text-sm font-extrabold uppercase tracking-wider text-black hover:text-white flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <span>FALE COM UM CONSULTOR</span>
              </button>
            </div>

            {/* 3 Selos de Autoridade (Exibidos apenas no Desktop / Tablet grande; Ocultos no mobile para cópia fiel do site oficial) */}
            <div className="hidden md:grid pt-2 grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <Award className="w-4 h-4 text-[#FF0D0D] shrink-0" />
                <span>Certificada Land Rover</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-[#FF0D0D] shrink-0" />
                <span>Oficial Motor Group Brasil</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <Crown className="w-4 h-4 text-[#FF0D0D] shrink-0" />
                <span>Boutique desde 1999</span>
              </div>
            </div>

          </div>
        </div>

        {/* Linha de acabamento na base */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </section>

      {/* SEÇÃO PRINCIPAL: FORMULÁRIO NATIVO DE CAPTAÇÃO MOBILE-FIRST */}
      <main className="max-w-4xl mx-auto px-4 pt-2 sm:pt-4">
        
        <section id="lead-form-card" className="relative mb-10 sm:mb-12">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#FF0D0D]/40 via-transparent to-[#FF0D0D]/10 blur-md -z-10 opacity-70" />

          <div className="rounded-2xl bg-[#090909] border border-zinc-800 shadow-2xl overflow-hidden">
            
            {/* Header do Formulário (Espelhado fielmente nas campanhas) */}
            <div className="bg-gradient-to-r from-zinc-950 via-[#100404] to-zinc-950 p-6 sm:p-8 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF0D0D] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-[#FF0D0D]" />
                <span>Atendimento Exclusivo • Solution Place Blindagem</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white mb-2 leading-tight">
                Olá! Seja bem-vindo(a) à Solution Place Blindagem.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                Preencha o formulário abaixo para iniciar seu atendimento.
              </p>
            </div>

            {/* Corpo do Formulário */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              
              {/* CAMPO 1: NOME */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  1. Nome: <span className="text-[#FF0D0D]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite seu nome completo"
                    className={`w-full pl-10 pr-4 py-3.5 rounded-lg bg-zinc-950 border ${
                      formErrors.nome ? "border-red-500 ring-1 ring-red-500" : "border-zinc-800 focus:border-[#FF0D0D]"
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-all`}
                  />
                </div>
                {formErrors.nome && (
                  <p className="text-red-400 text-xs font-medium pl-1">{formErrors.nome}</p>
                )}
              </div>

              {/* CAMPO DE CONTATO: WHATSAPP COM DDD */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  WhatsApp com DDD: <span className="text-[#FF0D0D]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(21) 99999-9999"
                    className={`w-full pl-10 pr-4 py-3.5 rounded-lg bg-zinc-950 border ${
                      formErrors.telefone ? "border-red-500 ring-1 ring-red-500" : "border-zinc-800 focus:border-[#FF0D0D]"
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-all`}
                  />
                </div>
                <p className="text-[11px] text-zinc-500 pl-1">
                  Seu atendimento técnico e proposta serão direcionados para este WhatsApp.
                </p>
                {formErrors.telefone && (
                  <p className="text-red-400 text-xs font-medium pl-1">{formErrors.telefone}</p>
                )}
              </div>

              {/* CAMPO 2: MARCA DO VEÍCULO */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  2. Marca do Veículo: <span className="text-[#FF0D0D]">*</span>
                </label>
                
                {/* Botões Rápidos de Marcas */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {vehicleCatalog.map(({ brand }) => {
                    const isBrandActive = formData.marca.toLowerCase() === brand.toLowerCase();
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleMarcaSelect(brand)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isBrandActive
                            ? "bg-[#FF0D0D] text-white border-[#FF0D0D] shadow-sm scale-[1.02]"
                            : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 active:scale-95"
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>

                {/* Barra de escrita distinta para a Marca */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        marca: val,
                        veiculo: `${val} ${prev.modelo}`.trim(),
                      }));
                      if (formErrors.marca) setFormErrors((prev) => ({ ...prev, marca: "" }));
                    }}
                    placeholder="Ou digite a marca do veículo (ex: Land Rover, BMW, Porsche...)"
                    className={`w-full pl-10 pr-4 py-3.5 rounded-lg bg-zinc-950 border ${
                      formErrors.marca ? "border-red-500 ring-1 ring-red-500" : "border-zinc-800 focus:border-[#FF0D0D]"
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-all`}
                  />
                </div>
                {formErrors.marca && (
                  <p className="text-red-400 text-xs font-medium pl-1">{formErrors.marca}</p>
                )}
              </div>

              {/* CAMPO 3: MODELO DO VEÍCULO (BARRA DE ESCRITA SEPARADA) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    3. Modelo do Veículo: <span className="text-[#FF0D0D]">*</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Orçamento calculado por modelo
                  </span>
                </div>

                {/* Modelos frequentes da marca selecionada */}
                {activeBrandCatalog && activeBrandCatalog.models.length > 0 && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5 animate-in fade-in duration-200">
                    <div className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF0D0D]"></span>
                      <span>Modelos frequentes ({activeBrandCatalog.brand}):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeBrandCatalog.models.map((modelName) => {
                        const isModelActive = formData.modelo.toLowerCase() === modelName.toLowerCase();
                        return (
                          <button
                            key={modelName}
                            type="button"
                            onClick={() => handleModeloSelect(modelName)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isModelActive
                                ? "bg-white text-black border-white shadow-md font-bold scale-[1.02]"
                                : "bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white active:scale-95"
                            }`}
                          >
                            {modelName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Barra de escrita distinta para o Modelo */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Car className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        modelo: val,
                        veiculo: `${prev.marca} ${val}`.trim(),
                      }));
                      if (formErrors.modelo) setFormErrors((prev) => ({ ...prev, modelo: "" }));
                    }}
                    placeholder="Digite ou selecione o modelo (ex: Defender 110, X5 M Sport, Cayenne Coupé...)"
                    className={`w-full pl-10 pr-4 py-3.5 rounded-lg bg-zinc-950 border ${
                      formErrors.modelo ? "border-red-500 ring-1 ring-red-500" : "border-zinc-800 focus:border-[#FF0D0D]"
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-all`}
                  />
                </div>
                {formErrors.modelo && (
                  <p className="text-red-400 text-xs font-medium pl-1">{formErrors.modelo}</p>
                )}
              </div>

              {/* CAMPO 4: ANO DO VEÍCULO */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  4. Ano do veículo: <span className="text-[#FF0D0D]">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {quickYearOptions.map((yearOption) => (
                    <button
                      key={yearOption}
                      type="button"
                      onClick={() => handleInputChange("ano", yearOption)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        formData.ano === yearOption
                          ? "bg-[#FF0D0D] text-white border-[#FF0D0D] shadow-sm"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 active:scale-95"
                      }`}
                    >
                      {yearOption}
                    </button>
                  ))}
                </div>

                <div className="relative pt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.ano}
                    onChange={(e) => handleInputChange("ano", e.target.value)}
                    placeholder="Ou digite o ano específico (Ex: 2026)"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border ${
                      formErrors.ano ? "border-red-500 ring-1 ring-red-500" : "border-zinc-800 focus:border-[#FF0D0D]"
                    } text-white placeholder-zinc-600 text-xs focus:outline-none transition-all`}
                  />
                </div>
                {formErrors.ano && (
                  <p className="text-red-400 text-xs font-medium pl-1">{formErrors.ano}</p>
                )}
              </div>

              {/* TERMO DE PRIVACIDADE NATIVO EXATO */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.aceitePrivacidade}
                    onChange={(e) => handleInputChange("aceitePrivacidade", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-[#FF0D0D] focus:ring-[#FF0D0D] accent-[#FF0D0D]"
                  />
                  <span className="text-[11px] text-zinc-400 group-hover:text-zinc-300 leading-relaxed">
                    Ao clicar em Enviar, você concorda em enviar suas informações para <strong>Solution Place Blindagem</strong>, que concorda em usá-las de acordo com a respectiva política de privacidade.
                  </span>
                </label>
                {formErrors.privacidade && (
                  <p className="text-red-400 text-xs font-medium pl-7 pt-1">{formErrors.privacidade}</p>
                )}
              </div>

              {/* BOTÃO DE SUBMISSÃO CTA NO ESTILO SOLUTION PLACE */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-lg solution-red-button text-white font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl cursor-pointer active:scale-[0.99] transition-all"
                >
                  <Send className="w-4 h-4 text-white fill-current" />
                  <span>Fale com um Consultor</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-zinc-500">
                  <Lock className="w-3.5 h-3.5 text-[#FF0D0D]" />
                  <span>Atendimento confidencial e seguro.</span>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* MODAL DE SUCESSO / ATENDIMENTO PRIORITÁRIO */}
        {isSubmitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="max-w-md w-full bg-[#0D0D0D] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold uppercase text-white">Solicitação Recebida!</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Olá, <strong className="text-white">{lastSubmittedLead?.nome}</strong>. Seus dados foram encaminhados à equipe de atendimento da Solution Place Blindagem.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-left text-xs space-y-1">
                <div className="text-[#FF0D0D] font-bold text-[10px] uppercase tracking-wider">Ficha de Atendimento:</div>
                <div className="text-zinc-300"><strong>Veículo:</strong> {lastSubmittedLead?.marca ? `${lastSubmittedLead.marca} ${lastSubmittedLead.modelo}` : lastSubmittedLead?.veiculo} ({lastSubmittedLead?.ano})</div>
                <div className="text-zinc-300"><strong>Contato:</strong> {lastSubmittedLead?.telefone}</div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={lastSubmittedLead ? generateWhatsAppUrl(lastSubmittedLead) : `https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (typeof window !== "undefined" && (window as any).fbq) {
                      (window as any).fbq("track", "Contact");
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Iniciar Conversa no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-2.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  Fechar janela
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO: NOSSOS PARCEIROS (EXATO DO SITE OFICIAL) */}
        <section className="mb-10 sm:mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              Nossos Parceiros
            </h2>
            <div className="w-16 h-1 bg-[#FF0D0D] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">JAGUAR LAND ROVER</span>
              <span className="text-[10px] text-[#FF0D0D] font-medium mt-1">Certificação Oficial de Fábrica</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">MOTOR GROUP BRASIL</span>
              <span className="text-[10px] text-[#FF0D0D] font-medium mt-1">Blindadora Oficial</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">BM RIO</span>
              <span className="text-[10px] text-zinc-400 font-normal mt-1">Rede Oficial BMW</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">DTC AUTOMOTIVE</span>
              <span className="text-[10px] text-zinc-400 font-normal mt-1">Superesportivos & Luxo</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center col-span-2 sm:col-span-1">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">GWM AMÉRICAS</span>
              <span className="text-[10px] text-zinc-400 font-normal mt-1">Híbridos & Elétricos</span>
            </div>
          </div>
        </section>

        {/* SEÇÃO: GALERIA DE VEÍCULOS BLINDADOS (EXCLUSIVAMENTE CARROS - 5 CARDS 3D COVERFLOW) */}
        <section className="mb-10 sm:mb-12 overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF0D0D]">Projetos Entregues</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-1">
              Galeria de Veículos Blindados
            </h2>
            <div className="w-16 h-1 bg-[#FF0D0D] mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-2 font-light">
              Deslize para navegar pelos projetos de alto padrão blindados com excelência cirúrgica em nossa boutique.
            </p>
          </div>

          {/* CARROSSEL 3D COVERFLOW (CARDS PERSISTENTES COM TRANSIÇÃO ULTRA-FLUIDA) */}
          <div className="relative py-2">
            
            {/* Contêiner dos Cards 3D com Posicionamento Absoluto e Persistência */}
            <div
              className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing [--card-step:145px] sm:[--card-step:215px] md:[--card-step:270px] lg:[--card-step:300px]"
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {vehicleGallery.map((item, idx) => {
                let diff = idx - activeGalleryIndex;
                const total = vehicleGallery.length;
                const half = total / 2;
                if (diff > half) diff -= total;
                if (diff <= -half) diff += total;

                const isCenter = diff === 0;
                const absDiff = Math.abs(diff);
                const isVisible = absDiff <= 2.2;
                const displayDiff = Math.max(-3, Math.min(3, diff));

                const scale = isCenter ? 1 : absDiff === 1 ? 0.88 : absDiff === 2 ? 0.76 : 0.65;
                const rotateY = isCenter ? 0 : diff > 0 ? -16 : 16;
                const translateZ = isCenter ? 30 : absDiff === 1 ? -25 : -80;
                const opacity = isCenter ? 1 : absDiff === 1 ? 0.85 : absDiff === 2 ? 0.45 : 0;
                const zIndex = 30 - Math.round(absDiff * 8);

                const dragPx = isDragging ? dragOffset : 0;

                return (
                  <div
                    key={item.src}
                    onClick={() => handleCardClick(idx, diff)}
                    style={{
                      transform: `perspective(1200px) translate3d(calc(-50% + ${displayDiff} * var(--card-step) + ${dragPx}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      visibility: isVisible ? "visible" : "hidden",
                      transition: isDragging
                        ? "none"
                        : "transform 650ms cubic-bezier(0.25, 1, 0.5, 1), opacity 650ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 650ms ease, border-color 650ms ease",
                      willChange: "transform, opacity",
                    }}
                    className={`absolute top-1/2 left-1/2 w-[220px] sm:w-[260px] md:w-[290px] lg:w-[320px] h-[320px] sm:h-[380px] md:h-[420px] lg:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group bg-zinc-950 border ${
                      isCenter
                        ? "border-[#FF0D0D]/70 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(255,13,13,0.35)] ring-1 ring-[#FF0D0D]/40"
                        : absDiff === 1
                        ? "border-zinc-800 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:border-zinc-700"
                        : "border-zinc-800/60 shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                    />

                    {/* Tag 'Ampliar' no card central */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-wider text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ampliar
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controles de Navegação: Setas e Pontos */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={() => setActiveGalleryIndex((prev) => (prev - 1 + vehicleGallery.length) % vehicleGallery.length)}
                className="p-2.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-[#FF0D0D] text-zinc-300 hover:text-white transition-all active:scale-95 shadow-md"
                aria-label="Veículo Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Indicadores de Paginação */}
              <div className="flex items-center gap-1.5">
                {vehicleGallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeGalleryIndex
                        ? "w-6 bg-[#FF0D0D] shadow-[0_0_10px_rgba(255,13,13,0.8)]"
                        : "w-1.5 bg-zinc-800 hover:bg-zinc-700"
                    }`}
                    aria-label={`Ver veículo ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveGalleryIndex((prev) => (prev + 1) % vehicleGallery.length)}
                className="p-2.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-[#FF0D0D] text-zinc-300 hover:text-white transition-all active:scale-95 shadow-md"
                aria-label="Próximo Veículo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dica de interação sutil */}
            <p className="text-[10px] text-zinc-500 text-center mt-2 font-normal">
              Arraste para os lados ou clique em qualquer card para navegar
            </p>
          </div>

          {/* Banner Chamada para Cotação sob a Galeria */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase text-white">
                Seu veículo merece o padrão da Primeira Blindadora Boutique do Mundo
              </p>
            </div>
            <button
              onClick={scrollToForm}
              className="solution-red-button px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white shrink-0 active:scale-95 transition-all"
            >
              Cotar Blindagem do Meu Veículo
            </button>
          </div>
        </section>

        {/* LIGHTBOX MODAL PARA VISUALIZAÇÃO AMPLIADA DA FOTO */}
        {selectedGalleryImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <div
              className="relative max-w-3xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão fechar discreto no canto superior */}
              <button
                onClick={() => setSelectedGalleryImage(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Fechar"
              >
                ✕
              </button>

              <div className="relative max-h-[75vh] flex items-center justify-center bg-black">
                <img
                  src={selectedGalleryImage.src}
                  alt="Veículo Blindado Solution Place"
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-end gap-3 border-t border-zinc-900 bg-zinc-950">
                <button
                  onClick={() => {
                    setSelectedGalleryImage(null);
                    scrollToForm();
                  }}
                  className="w-full sm:w-auto solution-red-button px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white active:scale-95 transition-all text-center"
                >
                  Fale com um consultor
                </button>
                <button
                  onClick={() => setSelectedGalleryImage(null)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white active:scale-95 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO: FAQ RETRÁTIL */}
        <section className="mb-10 sm:mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              Dúvidas Frequentes
            </h2>
            <div className="w-16 h-1 bg-[#FF0D0D] mx-auto mt-2" />
          </div>

          <div className="space-y-2.5 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-950 border border-zinc-900 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#FF0D0D] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 bg-black/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO: LOCALIZAÇÃO & ENDEREÇO OFICIAL */}
        <section className="mb-14 p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-900 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#FF0D0D] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#FF0D0D]" />
              <span>Showroom & Ateliê de Blindagem</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold uppercase text-white">
              Estrada da Barra da Tijuca, 465
            </h3>
            <p className="text-xs text-zinc-400">
              Barra da Tijuca, Rio de Janeiro - RJ • CEP 22611-201
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Estrada+da+Barra+da+Tijuca+465+Rio+de+Janeiro"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 transition-all active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF0D0D]" />
            <span>Como Chegar</span>
          </a>
        </section>

        {/* FOOTER OFICIAL COM REDES SOCIAIS E COPYRIGHT */}
        <footer className="text-center text-xs text-zinc-500 border-t border-zinc-900 pt-8 pb-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/solution-place/Logo-Solution-branco.webp"
              alt="Solution Place Blindagem"
              className="h-8 w-auto opacity-80"
            />
          </div>

          {/* Redes Sociais Oficiais */}
          <div className="flex items-center justify-center gap-4 text-zinc-400 pt-1">
            <a
              href="https://www.instagram.com/solutionplaceblindagem/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-zinc-950 border border-zinc-800 hover:text-[#FF0D0D] hover:border-[#FF0D0D] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@SolutionPlaceBlindagem"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-zinc-950 border border-zinc-800 hover:text-[#FF0D0D] hover:border-[#FF0D0D] transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} Solution Place Blindagem. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-zinc-600 max-w-md mx-auto">
            Primeira Blindadora Boutique do Mundo. Única carioca certificada de fábrica Jaguar Land Rover. Blindadora oficial Motor Group Brasil.
          </p>
        </footer>
      </main>

      {/* Botão Flutuante Oficial do WhatsApp com Rastreamento Meta */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pela Landing Page da Solution Place Blindagem e gostaria de falar com um consultor.")}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "Contact");
          }
        }}
        className="fixed bottom-5 right-5 z-40 p-3.5 sm:p-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Fale conosco no WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
