'use client';

import React, { useState, useEffect } from 'react';
import { OrderDetailsData, OrderItem } from '@/lib/types';

function prepOrderDetails(orderDetailsData: string): OrderDetailsData {
  try {
    const parsedItems: OrderItem[] = JSON.parse(orderDetailsData);
    console.log('Parsed Items:', parsedItems);

    const totalAmount = parsedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    console.log('Total Amount:', totalAmount);

    // Construct the final order details object with total amount
    const orderDetails: OrderDetailsData = {
      items: parsedItems,
      totalAmount: Number(totalAmount.toFixed(2))
    };
    console.log('Order Details:', orderDetails);

    return orderDetails;
  } catch (error) {
    console.error('Failed to parse order details:', error);
    throw new Error(`Failed to parse order details: ${error}`);
  }
}

const OrderDetails: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsData>({
    items: [],
    totalAmount: 0
  });

  useEffect(() => {
    const handleOrderUpdate = (event: CustomEvent<string>) => {
      console.log('Received event:', event.detail);

      try {
        const formattedData: OrderDetailsData = prepOrderDetails(event.detail);
        setOrderDetails(formattedData);
      } catch (error) {
        console.error('Error processing order update:', error);
      }
    };

    const handleCallEnded = () => {
      console.log("Ordered:", orderDetails);
    };

    window.addEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, [orderDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatOrderItem = (item: OrderItem, index: number) => (
    <div
      key={index}
      className="group mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:border-white/40 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-white">{item.quantity}x {item.name}</span>
        <span className="text-green-400 font-semibold">{formatCurrency(item.price * item.quantity)}</span>
      </div>
      {item.specialInstructions && (
        <div className="text-sm text-gray-300 italic mt-1">
          Note: {item.specialInstructions}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-10 text-white">
      <h1 className="text-white text-4xl font-bold mb-8 text-center animate-fade-in bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Order Details
      </h1>
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20 animate-slide-up">
        <div className="mb-6">
          <span className="text-gray-300 text-lg font-semibold mb-2 block">Items:</span>
          {orderDetails.items.length > 0 ? (
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => formatOrderItem(item, index))}
            </div>
          ) : (
            <span className="text-gray-400 text-base font-mono">No items</span>
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex justify-between items-center font-bold">
            <span className="text-gray-300 text-lg font-semibold">Total:</span>
            <span className="text-green-400 text-2xl font-bold animate-pulse">
              {formatCurrency(orderDetails.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;