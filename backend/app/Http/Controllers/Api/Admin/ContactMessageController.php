<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(){
        $message = ContactMessage::latest()->get();
        return response()->json($message);
    }

    public function show(ContactMessage $contactMessage){
        
        return response()->json($contactMessage);
    }

    public function toggleRead(ContactMessage $contactMessage){
        $contactMessage->update([
            'is_read' => !$contactMessage->is_read,
        ]);

        return response()->json([
            'message' => 'Message status updated successfully.',
            'data' => $contactMessage,
        ]);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Message Deleted Successfully'
        ]);
    }
}
