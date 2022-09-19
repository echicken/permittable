using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace permittable.PostgreSQL;
public class Permit
{
    public string? Number { get; set; }
    public string? AddressGeoID { get; set; }
    public Address? Address { get; set; }
    public DateTime? Applied { get; set; }
    public DateTime? Issued { get; set; }
    public DateTime? Completed { get; set; }
    public int Revision {get; set; }
    public string? PermitType { get; set; }
    public string? StructureType { get; set; }
    public string? ShortDescription { get; set; }
    public string? LongDescription { get; set; }
    public string? Status {get; set; }
    public string? CurrentUse { get; set; }
    public string? ProposedUse { get; set; }
    public int DwellingsCreated { get; set; }
    public int DwellingsLost { get; set; }
    public float EstimatedCost { get; set; }
}
