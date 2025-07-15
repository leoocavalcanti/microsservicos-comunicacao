import os
import consul
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConsulService:
    def __init__(self):
        self.host = os.getenv("CONSUL_HOST", "localhost")
        self.port = int(os.getenv("CONSUL_PORT", "8500"))
        self.service_name = os.getenv("SERVICE_NAME", "payment-bank")
        self.service_id = f"{self.service_name}-{os.getpid()}"
        self.service_port = int(os.getenv("PORT", "8000"))
        self.container_name = os.getenv("HOSTNAME", "localhost")

        self.consul = consul.Consul(
            host=self.host,
            port=self.port
        )
        logger.info(f"Consul client initialized with host={self.host}, port={self.port}")

    def register(self):
        try:
            self.consul.agent.service.register(
                name=self.service_name,
                service_id=self.service_id,
                address=self.container_name,
                port=self.service_port,
                check={
                    "http": f"http://{self.container_name}:{self.service_port}/health",
                    "interval": "10s",
                    "timeout": "5s"
                }
            )
            logger.info(f"Service registered in Consul: {self.service_name} (ID: {self.service_id})")
        except Exception as e:
            logger.error(f"Error registering service in Consul: {str(e)}")
            raise

    def deregister(self):
        try:
            self.consul.agent.service.deregister(self.service_id)
            logger.info(f"Service deregistered from Consul: {self.service_id}")
        except Exception as e:
            logger.error(f"Error deregistering service from Consul: {str(e)}") 