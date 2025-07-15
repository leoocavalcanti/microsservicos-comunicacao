// @ts-ignore
const Consul = require('consul');
import { createLogger } from './logger.service';

interface ConsulService {
  ID?: string;
  Service: string;
  Address: string;
  Port: number;
}

export class DiscoveryService {
  private readonly consul: any;
  private readonly logger = createLogger('DiscoveryService');
  private readonly serviceName: string;
  private readonly serviceId: string;

  constructor() {
    const host = process.env.CONSUL_HOST || 'localhost';
    const port = parseInt(process.env.CONSUL_PORT || '8500', 10);
    this.serviceName = process.env.SERVICE_NAME || 'payment-service';
    this.serviceId = `${this.serviceName}-${Date.now()}`;

    this.consul = new Consul({
      host,
      port,
    });

    this.logger.info('Discovery Service iniciado', { host, port, serviceName: this.serviceName });
  }

  async register(port: number): Promise<void> {
    try {
      await this.consul.agent.service.register({
        id: this.serviceId,
        name: this.serviceName,
        address: process.env.HOSTNAME || 'localhost',
        port,
        check: {
          http: `http://${process.env.HOSTNAME || 'localhost'}:${port}/health`,
          interval: '10s',
          timeout: '5s',
        },
      });

      this.logger.info('Serviço registrado no Consul', {
        serviceId: this.serviceId,
        serviceName: this.serviceName,
        port,
      });

      process.on('SIGINT', () => this.deregister());
      process.on('SIGTERM', () => this.deregister());
    } catch (error) {
      this.logger.error('Erro ao registrar serviço no Consul', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        serviceId: this.serviceId,
      });
      throw error;
    }
  }

  private async deregister(): Promise<void> {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
      this.logger.info('Serviço removido do Consul', { serviceId: this.serviceId });
    } catch (error) {
      this.logger.error('Erro ao remover serviço do Consul', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        serviceId: this.serviceId,
      });
    }
  }

  async getServiceAddress(serviceName: string): Promise<string | null> {
    try {
      const services = await this.consul.agent.service.list();
      const service = Object.values(services as Record<string, ConsulService>).find(
        (svc) => svc.Service === serviceName
      );

      if (!service) {
        this.logger.warn('Serviço não encontrado no Consul', { serviceName });
        return null;
      }

      const address = service.Address || 'localhost';
      const port = service.Port;

      this.logger.info('Endereço do serviço encontrado', {
        serviceName,
        address,
        port,
      });

      return `http://${address}:${port}`;
    } catch (error) {
      this.logger.error('Erro ao buscar endereço do serviço', {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        serviceName,
      });
      throw error;
    }
  }
} 