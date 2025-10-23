// import { Role } from "../roles/role.enum";

import { Menu } from "../enums/menu-enum/menu-Enum";

export const menuItem = [
  {
    name: Menu.DASHBOARD,
    icon: 'dashboard',
    router: '/dashboard',
    items: []
  },
  {
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
  },
  {
    name: Menu.REPORTES_ESTADISTICAS,
    icon: 'bar_chart',
    router: '',
    items: [
      {
        name: 'General',
        icon: 'assessment',
        router: '/reportes-estadisticas/general',
      },
      {
        name: 'Por Usuario',
        icon: 'person_search',
        router: '/reportes-estadisticas/usuarios',
      },
      {
        name: 'Suscripciones',
        icon: 'subscriptions',
        router: '/reportes-estadisticas/suscripciones',
      },
    ]
  },
  {
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
    name: Menu.NOTIFICACIONES,
    icon: 'notifications',
    router: '/notificaciones',
    items: []
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
  },
]
