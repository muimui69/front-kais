

import { Menu } from "../enums/menu-enum/menu-Enum";

export const menuItem = [
  {
    name: Menu.DASHBOARD,
    icon: 'dashboard',
    router: '/dashboard',
    items: []
  },
  /*{
    name: Menu.GESTION_USUARIOS,
    icon: 'group',
    router: 'users',
    items: [
      {
        name: 'Usuarios del sistema',
        icon: 'person',
        router: '/users/user-manegement',
        // role: [Role.ADMIN]
      },
    ]
  },
  {
    name: Menu.VERIFICACION_PROFESIONALES,
    icon: 'verified_user',
    router: '',
    items: [
      {
        name: 'Pendientes',
        icon: 'hourglass_empty',
        router: '/verificacion-profesionales/pendientes',
      },
      {
        name: 'Verificados',
        icon: 'verified',
        router: '/verificacion-profesionales/verificados',
      },
    ]
  },*/
  {
    name: Menu.REPORTES_ESTADISTICAS,
    icon: 'bar_chart',
    router: '',
    items: [
      {
        name: 'Bitacora General',
        icon: 'assessment',
        router: '/bitacora',
      },

    ]
  },
  /*{
    name: Menu.MODERACION_CONTENIDO,
    icon: 'gavel',
    router: '',
    items: [
      {
        name: 'Reportes de Conducta',
        icon: 'report_problem',
        router: '/moderacion-contenido/reportes',
      },
      {
        name: 'Comentarios',
        icon: 'comment',
        router: '/moderacion-contenido/comentarios',
      },
    ]
  },
  {
    name: Menu.SOLICITUDES_SERVICIO,
    icon: 'assignment',
    router: '',
    items: [
      {
        name: 'Pendientes',
        icon: 'pending_actions',
        router: '/solicitudes-servicio/pendientes',
      },
      {
        name: 'Historial',
        icon: 'history',
        router: '/solicitudes-servicio/historial',
      },
    ]
  },
  {
    name: Menu.SUSCRIPCIONES_PAGOS,
    icon: 'credit_card',
    router: '',
    items: [
      {
        name: 'Gestión de Suscripciones',
        icon: 'subscriptions',
        router: '/suscripciones-pagos/gestion',
      },
      {
        name: 'Pagos',
        icon: 'attach_money',
        router: '/suscripciones-pagos/pagos',
      },
    ]
  },
  {
    name: Menu.CONFIGURACION,
    icon: 'settings',
    router: '/configuracion',
    items: []
  },
  {
    name: Menu.SOPORTE,
    icon: 'support_agent',
    router: '/soporte',
    items: []
  },*/
  {
    name: Menu.CATEGORIAS_SERVICIOS,
    icon: 'category',
    router: '/categories/category',
    items: []
  },
  {
    name: Menu.EMPRESAS_SUSCRIPCIONES,
    icon: 'bar_chart',
    router: '',
    items: [
      {
        name: 'Suscripciones Empresas',
        icon: 'business_center',
        router: '/ad-subscriptions',
      },
      {
        name: 'Empresas',
        icon: 'business',
        router: '/companies',
      },
      {
        name: 'Publicidad',
        icon: 'campaign',
        router: '/publicidad/ads',
      },
      {
        name: 'Planes de Publicidad',
        icon: 'monetization_on',
        router: '/ad-plans',
      },
      {
        name: 'Cupones',
        icon: 'local_offer',
        router: '/coupons',
      },
      /*{
        name: 'Créditos',
        icon: 'account_balance_wallet',
        router: '/credits',
      }
      {
        name: 'Referidos',
        icon: 'people',
        router: '/referrals',
      }*/
    ],
  },
  {
    name: Menu.NOTIFICACIONES,
    icon: 'notifications',
    router: '',
    items: [
      {
        name: 'Programar Notificación',
        icon: 'timer',
        router: '/notifications/scheduled',
      },
      // {
      //   name: 'Enviar Notificación',
      //   icon: 'send',
      //   router: '/notifications/immediate',
      // }
    ]
  },

]
