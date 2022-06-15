from email import charset
from unittest import result
from django.http import JsonResponse
from django.shortcuts import render
from .models import *
import enchant
import numpy as np
import json

try_result = np.matrix([[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1],[-1, -1, -1, -1, -1]])

# Create your views here.
def home(request):
    return render(request,"index.html")

def rules(request):
    return render(request,"index1.html")

def ajax_wordcheck(request):
    dct = enchant.Dict('en_US')
    res_check = 2
    if request.method == 'GET':
        word = request.GET.get('word','')
        flag = dct.check(word)
        if flag:
            res_check = 1
        else:
            res_check = 0
    return JsonResponse(res_check, safe=False, json_dumps_params={'ensure_ascii':False})

def ajax_wordget(request):
    defalut_word = 'happy'
    if request.method == 'POST':
        random_word = list(Word.objects.order_by('?')[:1].values('word'))
        chosen_word = random_word[0]['word']
        return JsonResponse(chosen_word, safe=False)
    return JsonResponse(defalut_word, safe=False, json_dumps_params={'ensure_ascii':False})

def ajax_point(request):
    if request.method == 'GET':
        result = request.GET.get('result', '')
        row = request.GET.get('row', '')
        for i in [0,1,2,3,4]:
            try_result[int(row),i] = result[i]
    
    return JsonResponse(1, safe=False, json_dumps_params={'ensure_ascii':False})

def ajax_result(request):
    if request.method == 'POST':
        result_r = []
        tmp = 0
        while (try_result[tmp,0] != -1):
            tmp = tmp + 1
            str_row = ''
            for j in range (5):
                str_row = str_row + str(try_result[tmp-1,j])
            result_r.append(str_row)
            if(tmp == 6):
                break
        return JsonResponse(result_r, safe=False, json_dumps_params={'ensure_ascii':False})



        

def test(request):
    return render(request, "test.html")