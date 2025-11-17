import requests
import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ExchangeRate
from django.shortcuts import render

def home(request):

    return render(request, "index.html")

load_dotenv()

class ExchangeRateView(APIView):
    """
    POST payload example:
    {
        "base": "USD",
        "target": "PKR",
        "amount": 250
    }
    """

    def post(self, request):
        base = request.data.get('base', 'USD')
        target = request.data.get('target', 'PKR')
        amount = float(request.data.get('amount', 1))

        api_key = os.getenv('EXCHANGE_API_KEY')
        if not api_key:
            return Response({"error": "Missing API key in environment variables"}, status=500)

        url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base}"

        try:
            response = requests.get(url)
            data = response.json()

            if response.status_code == 200 and data.get("conversion_rates"):
                rate = data['conversion_rates'].get(target)
                if rate:
                    converted_amount = round(amount * rate, 2)
                else:
                    converted_amount = None

                # Keep only the target currency in conversion_rates
                filtered_data = data.copy()
                filtered_data['conversion_rates'] = {target: rate} if rate else {}

                # Save record in DB including amount and converted_amount
                ExchangeRate.objects.create(
                    base_currency=base,
                    target_currency=target,
                    exchange_rate=rate if rate else 0.0,
                    amount=amount,
                    converted_amount=converted_amount if converted_amount else 0.0,
                    full_response=filtered_data
                )

                return Response({
                    "status": "success",
                    "base_currency": base,
                    "target_currency": target,
                    "exchange_rate": rate,
                    "amount": amount,
                    "converted_amount": converted_amount,
                    "full_api_response": filtered_data
                })

            else:
                return Response({
                    "status": "error",
                    "message": data.get("error-type", "Unable to fetch exchange rate"),
                    "api_response": data
                }, status=400)

        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=500)
