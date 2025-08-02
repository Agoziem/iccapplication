export const shortenMessage = (message: string, limit: number) => {
  if (message.length > limit) {
    return message.substring(0, limit) + "...";
  }
  return message;
};


export const transformNullFields = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(transformNullFields); // Recursively transform arrays
  } else if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === null ? "" : transformNullFields(value),
      ])
    );
  }
  return data;
};

export function formatNaira(amount: number | string): string {
  const number = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(number)) return  "₦0";
  if (number < 0) return `₦-${Math.abs(number).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
  return `₦${number.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

