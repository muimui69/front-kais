
import { Menu } from "../enums/menu-enum/menu-Enum";

export interface SubMenuItem {
  name: string;
  icon: string;
  router: string;
  permissions?: string[];
}

export interface MenuItem {
  name: Menu;
  icon: string;
  router: string;
  permissions?: string[];
  items: SubMenuItem[];
}

export const menuItem: MenuItem[] = [
  {
    name: Menu.DASHBOARD,
    icon: 'dashboard',
    router: '/dashboard',
    items: []
  },
  {
    name: Menu.GESTION_USUARIOS,
    icon: 'manage_accounts',
    router: '',
    items: [
      {
        name: 'Administradores',
        icon: 'admin_panel_settings',
        router: '/administrators',
      },
      {
        name: 'Roles',
        icon: 'badge',
        router: '/roles',
       // permissions: ['usuarios_rol_listar'],
      },
    ]
  },
  {
    name: Menu.VERIFICACION_PROFESIONALES,
    icon: 'verified_user',
    router: '',
    items: [
      {
        name: 'Documentos de Profesionales',
        icon: 'badge',
        router: '/professional-documents',
        //permissions: ['documentos_profesional_ver', 'documentos_profesional_verificar'],
      },
    ]
  },
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
  {
    name: Menu.PLANES_PROFESIONALES,
    icon: 'card_membership',
    router: '',
    items: [
      {
        name: 'Planes',
        icon: 'view_list',
        router: '/planes',
        permissions: ['planes_plan_listar'],
      },
      {
        name: 'Catálogo de Features',
        icon: 'featured_play_list',
        router: '/planes/features',
        permissions: ['planes_feature_listar'],
      },
      {
        name: 'Suscripciones',
        icon: 'subscriptions',
        router: '/planes/subscriptions',
        permissions: ['planes_suscripcion_listar'],
      },
    ]
  },

]
