"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  X,
  SlidersHorizontal,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/lib/types/api";

export interface BookingFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  timeRange: {
    start: string;
    end: string;
  };
  mentee: string;
  sortBy: 'date' | 'created' | 'updated' | 'mentee';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedBookingFiltersProps {
  bookings: Booking[];
  onFiltersChange: (filteredBookings: Booking[], activeFilters: BookingFilters) => void;
  onExport?: (filteredBookings: Booking[]) => void;
}

export function AdvancedBookingFilters({ 
  bookings, 
  onFiltersChange, 
  onExport 
}: AdvancedBookingFiltersProps) {
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: 'all',
    dateRange: { start: '', end: '' },
    timeRange: { start: '', end: '' },
    mentee: 'all',
    sortBy: 'created',
    sortOrder: 'desc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get unique mentees for filter dropdown
  const uniqueMentees = Array.from(
    new Set(bookings.map(booking => booking.mentee))
  ).sort();

  // Apply filters and sorting
  const filteredBookings = bookings.filter(booking => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        booking.mentee.toLowerCase().includes(searchLower) ||
        booking.title?.toLowerCase().includes(searchLower) ||
        booking.note?.toLowerCase().includes(searchLower) ||
        '';
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const bookingDate = new Date(booking.day);
      if (filters.dateRange.start && bookingDate < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && bookingDate > new Date(filters.dateRange.end)) {
        return false;
      }
    }

    // Time range filter
    if (booking.time && (filters.timeRange.start || filters.timeRange.end)) {
      const bookingTime = booking.time;
      if (filters.timeRange.start && bookingTime < filters.timeRange.start) {
        return false;
      }
      if (filters.timeRange.end && bookingTime > filters.timeRange.end) {
        return false;
      }
    }

    // Mentee filter
    if (filters.mentee !== 'all' && booking.mentee !== filters.mentee) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    let aValue: any, bValue: any;

    switch (filters.sortBy) {
      case 'date':
        aValue = new Date(a.day);
        bValue = new Date(b.day);
        break;
      case 'created':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'updated':
        aValue = new Date(a.updated_at);
        bValue = new Date(b.updated_at);
        break;
      case 'mentee':
        aValue = a.mentee.toLowerCase();
        bValue = b.mentee.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange(filteredBookings, filters);
  }, [filteredBookings, filters, onFiltersChange]);

  const updateFilter = (key: keyof BookingFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: { start: '', end: '' },
      timeRange: { start: '', end: '' },
      mentee: 'all',
      sortBy: 'created',
      sortOrder: 'desc',
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.timeRange.start || filters.timeRange.end) count++;
    if (filters.mentee !== 'all') count++;
    return count;
  };

  const exportFilteredData = () => {
    if (onExport) {
      onExport(filteredBookings);
    } else {
      // Default CSV export
      const csvContent = [
        ['Date', 'Time', 'Mentee', 'Title', 'Status', 'Note', 'Created', 'Updated'].join(','),
        ...filteredBookings.map(booking => [
          booking.day,
          booking.time || '',
          booking.mentee,
          booking.title || '',
          booking.status,
          booking.note || '',
          new Date(booking.created_at).toLocaleDateString(),
          new Date(booking.updated_at).toLocaleDateString(),
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Advanced</span>
            </Button>
            
            {filteredBookings.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={exportFilteredData}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            )}
            
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bookings..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.mentee} onValueChange={(value) => updateFilter('mentee', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by mentee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mentees</SelectItem>
              {uniqueMentees.map(mentee => (
                <SelectItem key={mentee} value={mentee}>{mentee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Time Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={filters.timeRange.start}
                    onChange={(e) => updateFilter('timeRange', { ...filters.timeRange, start: e.target.value })}
                    placeholder="Start time"
                  />
                  <Input
                    type="time"
                    value={filters.timeRange.end}
                    onChange={(e) => updateFilter('timeRange', { ...filters.timeRange, end: e.target.value })}
                    placeholder="End time"
                  />
                </div>
              </div>
            </div>

            {/* Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Booking Date</SelectItem>
                    <SelectItem value="created">Created Date</SelectItem>
                    <SelectItem value="updated">Updated Date</SelectItem>
                    <SelectItem value="mentee">Mentee Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort Order</label>
                <Select value={filters.sortOrder} onValueChange={(value: any) => updateFilter('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
          
          {activeFilterCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && <Badge variant="outline">Search: "{filters.search}"</Badge>}
              {filters.status !== 'all' && <Badge variant="outline">Status: {filters.status}</Badge>}
              {filters.mentee !== 'all' && <Badge variant="outline">Mentee: {filters.mentee}</Badge>}
              {(filters.dateRange.start || filters.dateRange.end) && (
                <Badge variant="outline">Date Range</Badge>
              )}
              {(filters.timeRange.start || filters.timeRange.end) && (
                <Badge variant="outline">Time Range</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
