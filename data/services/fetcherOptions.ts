import type { Service, Services } from "@/types/items";

/**
 * Add Service Response Configuration for optimistic updates
 */
export const addServiceOptions = (newService: Service) => {
  return {
    optimisticData: (services: Services): Services =>
      [...services, newService].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),

    rollbackOnError: true,
    populateCache: (addedService: Service, services: Services): Services =>
      [...services, addedService].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      ),
    revalidate: false,
  };
};

/**
 * Update Service Configuration for optimistic updates
 */
export const updateServiceOptions = (updatedService: Service) => {
  return {
    optimisticData: (services: Services): Services => {
      return services.map((service) =>
        service.id === updatedService.id ? { ...service, ...updatedService } : service
      );
    },

    rollbackOnError: true,
    populateCache: (updatedServiceResponse: Service, services: Services): Services => {
      return services.map((service) =>
        service.id === updatedServiceResponse.id ? updatedServiceResponse : service
      );
    },
    revalidate: false,
  };
};

/**
 * Delete Service Configuration for optimistic updates
 */
export const deleteServiceOptions = (serviceId: number) => {
  return {
    optimisticData: (services: Services): Services => {
      return services.filter((service) => service.id !== serviceId);
    },

    rollbackOnError: true,
    populateCache: (deletedServiceId: number, services: Services): Services => {
      return services.filter((service) => service.id !== deletedServiceId);
    },
    revalidate: false,
  };
};
