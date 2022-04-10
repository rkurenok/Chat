using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRService
{
    public class ChatHub : Hub
    {
        public async Task Send(string username, string message, string time)
        {
            await this.Clients.All.SendAsync("Receive", username, message, time);
        }
    }
}
