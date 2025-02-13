using Microsoft.EntityFrameworkCore;
using DisasterManagement.IncidentService.Models;
using System.Collections.Generic;

namespace DisasterManagement.IncidentService.Data
{
    public class IncidentDbContext : DbContext
    {
        public IncidentDbContext(DbContextOptions<IncidentDbContext> options) : base(options) { }

        public DbSet<Incident> Incidents { get; set; }
    }
}
