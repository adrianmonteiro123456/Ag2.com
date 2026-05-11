/* ============================================
   CAMPANHA DO AGASALHO - SENAC SERRA TALHADA
   INTERAÇÕES, ANIMAÇÕES, MAPA E FLUIDEZ
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- INICIALIZA AOS (Animate on Scroll) ----------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
      offset: 50,
      delay: 0,
    });
  }

  // ---------- HEADER: EFEITO SCROLL ----------
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ---------- SCROLL SUAVE PARA LINKS INTERNOS ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ---------- ANIMAÇÃO DA BARRA DE PROGRESSO ----------
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Define a porcentagem (42% para R$8.450 de R$20.000)
          progressFill.style.width = '42%';
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    progressObserver.observe(progressFill);
  }

  // ---------- CONTADORES ANIMADOS (NÚMEROS DE IMPACTO) ----------
  const counters = document.querySelectorAll('.counter-animated');
  
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    
    const duration = 2000; // 2 segundos
    const step = Math.ceil(target / (duration / 16)); // 60 FPS aproximado
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current >= target) {
        element.textContent = target.toLocaleString('pt-BR');
        return;
      }
      element.textContent = current.toLocaleString('pt-BR');
      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ---------- COPIAR CHAVE PIX ----------
  const copyButtons = document.querySelectorAll('.btn-copiar-pix');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chave = btn.getAttribute('data-chave') || '00.000.000/0000-00';
      
      navigator.clipboard.writeText(chave).then(() => {
        // Feedback visual sutil
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        btn.style.background = '#004a87';
        btn.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.transform = '';
        }, 2000);
      }).catch(() => {
        // Fallback para navegadores que não suportam clipboard
        alert('Chave PIX: ' + chave);
      });
    });
  });

  // ---------- FAQ: COMPORTAMENTO SANFONADO ----------
  const faqDetails = document.querySelectorAll('.faq-item');
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (this.open) {
        faqDetails.forEach(other => {
          if (other !== this && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // ---------- PARALLAXE LEVE NO HERO ----------
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollValue = window.scrollY;
      if (scrollValue < heroSection.offsetHeight) {
        heroSection.style.backgroundPositionY = `${scrollValue * 0.4}px`;
      }
    });
  }

  // ---------- INDICADOR DE ROLAGEM: CLICAR LEVA À PRÓXIMA SEÇÃO ----------
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('#impactos') || document.querySelector('#sobre');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------- MAPA INTERATIVO (LEAFLET) ----------
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    // Coordenadas centrais de Serra Talhada - PE
    const coordenadasCentro = [-7.9900, -38.2950];
    const zoomPadrao = 14;

    // Inicializa o mapa
    const map = L.map('map').setView(coordenadasCentro, zoomPadrao);

    // Camada de tiles (estilo claro e clean)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Ícone personalizado para os marcadores
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: #005CA9;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 92, 169, 0.45);
          font-size: 16px;
          border: 2px solid white;
        ">
          <i class="fas fa-map-marker-alt"></i>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });

    // Array com os pontos de coleta
    const pontosDeColeta = [
      {
        nome: 'Concatedral N. Sra. da Penha',
        lat: -7.9890,
        lng: -38.2950,
        endereco: 'Praça Dr. Sergio Magalhães, 965 - Nossa Sra. da Penha',
        horario: 'Seg a Sex: 8h às 17h'
      },
      {
        nome: 'SENAC Serra Talhada',
        lat: -7.9860,
        lng: -38.2930,
        endereco: 'Av. Waldemar Ignácio de Oliveira, 325 - Bom Jesus',
        horario: 'Seg a Sex: 8h às 20h'
      },
      {
        nome: 'Assaí Atacadista',
        lat: -7.9830,
        lng: -38.2900,
        endereco: 'Av. Waldemar Ignácio de Oliveira, S/N - Alto Bom Jesus',
        horario: 'Seg a Sáb: 7h às 22h'
      },
      {
        nome: 'Centro Universitário FIS - UniFIS',
        lat: -7.9910,
        lng: -38.2980,
        endereco: 'R. João Luiz de Melo, 2110 - Tancredo Neves',
        horario: 'Seg a Sex: 8h às 21h'
      },
      {
        nome: 'UAST-UFRPE',
        lat: -7.9950,
        lng: -38.3000,
        endereco: 'Av. Gregório Ferraz Nogueira, s/n',
        horario: 'Seg a Sex: 7h às 19h'
      }
    ];

    // Adiciona os marcadores ao mapa
    pontosDeColeta.forEach(ponto => {
      const marker = L.marker([ponto.lat, ponto.lng], { icon: customIcon }).addTo(map);
      
      // Popup estilizado
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 4px 0;">
          <strong style="color: #003B73; font-size: 0.95rem;">${ponto.nome}</strong><br>
          <small style="color: #5F6B7A;">${ponto.endereco}</small><br>
          <small style="color: #5F6B7A;"><i class="far fa-clock"></i> ${ponto.horario}</small><br>
          <a href="https://maps.google.com/?q=${ponto.lat},${ponto.lng}" 
             target="_blank" 
             style="color: #005CA9; font-weight: 600; text-decoration: none; font-size: 0.9rem;">
            <i class="fas fa-external-link-alt"></i> Abrir no Google Maps
          </a>
        </div>
      `);
    });

    // Ajusta o mapa quando a janela é redimensionada
    window.addEventListener('resize', () => {
      map.invalidateSize();
    });

    // Força o redimensionamento quando a seção se torna visível
    const mapaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            map.invalidateSize();
          }, 300);
          mapaObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    mapaObserver.observe(mapElement);
  }

  // ---------- LINKS "ABRIR NO GOOGLE MAPS" NOS CARDS ----------
  document.querySelectorAll('.btn-maps').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // O link já funciona nativamente com href e target="_blank"
      // Este evento extra serve para tracking ou animações futuras
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });

  // ---------- MICROINTERAÇÕES NOS CARDS DE DOADORES ----------
  const doadorCards = document.querySelectorAll('.doador-card');
  doadorCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const avatar = this.querySelector('.doador-avatar');
      if (avatar) {
        avatar.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const avatar = this.querySelector('.doador-avatar');
      if (avatar) {
        avatar.style.transform = '';
      }
    });
  });

  console.log('✅ Campanha do Agasalho SENAC Serra Talhada – todos os scripts iniciados com sucesso.');
  console.log('📍 Mapa interativo carregado com', document.querySelectorAll('#map .custom-marker').length || 5, 'pontos de coleta.');
});