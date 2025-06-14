﻿namespace React_AspNetCore.Server.Models.Identity
{
    public class PagedResult<T>
    {
        public int TotalCount { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}
