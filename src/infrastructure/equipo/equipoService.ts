import type { Equipo, EquipoStats, RegistrarEquipoDTO } from '../../domain/equipo/Equipo'

const mockEquipos: Equipo[] = [
  { id: 'eq-1', tipo: 'SENSOR', estado: 'Asignado', nombre: 'Sensor Oxígeno Pro-V1',    serialNumber: 'YK-2023-00982',  codigoFisico: 'LOC-A2-S4',  ubicacion: 'Estanque Tilapia 04'      },
  { id: 'eq-2', tipo: 'PUMP',   estado: 'Libre',     nombre: 'Motobomba Sumergible HP2', serialNumber: 'PMP-XB-11200',   codigoFisico: 'EQ-STK-01',  ubicacion: 'Almacén Central'          },
  { id: 'eq-3', tipo: 'SENSOR', estado: 'Asignado', nombre: 'Kit pH Industrial Multi',   serialNumber: 'PH-KT-99212',    codigoFisico: 'LOC-B1-S1',  ubicacion: 'Estanque Maternidad 1'    },
  { id: 'eq-4', tipo: 'PUMP',   estado: 'Libre',     nombre: 'Aireador de Paletas 1.5hp',serialNumber: 'AIR-PAL-202',    codigoFisico: 'EQ-AIR-08',  ubicacion: 'Talleres Mantenimiento'   },
]

export const equipoService = {
  getAll: async (): Promise<Equipo[]> => {
    // TODO: GET /api/equipos
    return mockEquipos
  },

  getStats: async (): Promise<EquipoStats> => {
    // TODO: GET /api/equipos/stats
    return { totalEquipos: 42, sensoresActivos: 28, bombasEnOperacion: 14, requiereMantension: 3 }
  },

  registrar: async (_data: RegistrarEquipoDTO): Promise<void> => {
    // TODO: POST /api/equipos
  },

  eliminar: async (_id: string): Promise<void> => {
    // TODO: DELETE /api/equipos/:id
  },

  asignarEstanque: async (_id: string, _estanqueId: string): Promise<void> => {
    // TODO: PATCH /api/equipos/:id/asignar
  },
}
