export interface ContainerInfo {
    id: string;
    name: string;
    status: string;
    image: string;
    state: string;
    ports: PortMapping[];
}

export interface PortMapping {
    hostPort: string;
    containerPort: string;
}